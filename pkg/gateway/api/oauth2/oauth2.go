package oauth2

import (
	"context"
	"errors"
	"fmt"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/api/v1/models"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/database"
	"github.com/ShuzZzle/cortex-gateway/pkg/gateway/util"
	"github.com/coreos/go-oidc"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/oauth2"
	"net/http"
	"net/url"
	"os"
	"strings"
)

type Configuration struct {
	providerURL  string
	oauth2Config oauth2.Config
	oidcConfig   *oidc.Config
	verifier     *oidc.IDTokenVerifier
	database	 *database.Database
}

type JWTClaims struct {
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
}



func GetAccessToken(ctx *gin.Context) (string, error){
	header := ctx.GetHeader("Authorization")
	if header != "" {
		parts := strings.Split(header, " ")
		if len(parts) != 2 {
			ctx.Writer.WriteHeader(http.StatusBadRequest)
			return "", errors.New("invalid token")
		}
		return parts[1], nil
	}
	cookie, err := ctx.Cookie("key")
	return cookie, err
}

func SetAccessToken(ctx *gin.Context, token string) {
	ctx.SetCookie("key", token, 180, "/", "localhost", true, true)
}

func PushRedirect(uri string, redirect string) string {
	return fmt.Sprintf("%s?redirect_uri=%s", uri, url.QueryEscape(redirect))
}

func PopRedirect(uri string) (string, error) {
	from, err := url.Parse(uri)
	if err != nil {
		return "", err
	}
	return from.Query().Get("redirect_uri"), nil
}

func (config *Configuration) Authenticate() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		redirectUri := ctx.Request.RequestURI

		accessToken, err := GetAccessToken(ctx)
		if err != nil {
			ctx.Redirect(http.StatusFound, PushRedirect("/api/login", redirectUri))
			ctx.Abort()
			return
		}

		_, err = config.verifier.Verify(ctx, accessToken)

		if err != nil {
			fmt.Println(err)
			ctx.Redirect(http.StatusFound, PushRedirect("/api/login", redirectUri))
			ctx.Abort()
			return
		}
		ctx.Next()
	}
}

func (config *Configuration) Login(ctx *gin.Context) {
	accessToken, err := GetAccessToken(ctx)
	state := util.RandStringRunes(16)
	ctx.SetCookie("oauth2_state", state, 180, "/", "localhost", true, true)
	redirectUri := ctx.Query("redirect_uri")
	config.oauth2Config.RedirectURL = PushRedirect("http://localhost:8080/api/callback", redirectUri)
	if accessToken == "" {
		ctx.Redirect(http.StatusFound, config.oauth2Config.AuthCodeURL(state))
		return
	}

	_, err = config.verifier.Verify(ctx, accessToken)

	if err != nil {
		ctx.Redirect(http.StatusFound, config.oauth2Config.AuthCodeURL(state))
		return
	}

	ctx.Redirect(http.StatusFound, ctx.Request.Referer())
}

func (config *Configuration) Logout(ctx *gin.Context) {
	redirectUri := ctx.Query("redirect_uri")
	if redirectUri == "" {
		redirectUri = "http://localhost:8080/ui"
	}
	logoutUrl := fmt.Sprintf("%s/protocol/openid-connect/logout?redirect_uri=%s", config.providerURL, url.QueryEscape(redirectUri))
	ctx.Redirect(http.StatusFound, logoutUrl)
}

func (config *Configuration) GetUser(ctx *gin.Context, email string) {
	session := sessions.Default(ctx)
	// Try to find User by email
	userEntity := models.NewUserEntity(config.database.MongoDatabase)
	user, err := userEntity.Read(email)
	if err == mongo.ErrNoDocuments {
		// Create User
		user, err = userEntity.Create(email)
		if err != nil {
			// Error creating User
			fmt.Println(err)
		}
	} else {
		// Something bad happened
		fmt.Println(err)
	}
	session.Set("user", user)
	session.Save()
}

func (config *Configuration) Callback(ctx *gin.Context) {
	r := ctx.Request
	w := ctx.Writer

	// Verify State
	// SEE: https://datatracker.ietf.org/doc/html/rfc6819
	// OR: https://datatracker.ietf.org/doc/html/rfc6749#section-10.12
	// Prevents CSRF Attacks
	cookie, err := ctx.Cookie("oauth2_state")
	if err != nil {
		http.Error(w, "error extracting cookie oauth2_state", http.StatusInternalServerError)
		return
	}

	if r.URL.Query().Get("state") != cookie {
		http.Error(w, "state did not match", http.StatusBadRequest)
		return
	}

	oauth2Token, err := config.oauth2Config.Exchange(ctx, r.URL.Query().Get("code"))
	if err != nil {
		http.Error(w, "Failed to exchange token: "+err.Error(), http.StatusInternalServerError)
		return
	}
	rawIDToken, ok := oauth2Token.Extra("id_token").(string)
	if !ok {
		http.Error(w, "No id_token field in oauth2 token.", http.StatusInternalServerError)
		return
	}
	idToken, err := config.verifier.Verify(ctx, rawIDToken)
	if err != nil {
		http.Error(w, "Failed to verify ID Token: "+err.Error(), http.StatusInternalServerError)
		return
	}

	idtokenClaims := JWTClaims{}
	resp := struct {
		OAuth2Token   *oauth2.Token
		IDTokenClaims *JWTClaims // ID Token payload is just JSON.
	}{oauth2Token, &idtokenClaims}

	if err = idToken.Claims(&resp.IDTokenClaims); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println(idtokenClaims.Email)

	session := sessions.Default(ctx)
	if _, userCookieFound := session.Get("user").(models.User); !userCookieFound {
		//TODO: Do this everytime?!
		config.GetUser(ctx, "")
	}

	SetAccessToken(ctx, oauth2Token.AccessToken)

	redirectUri := ctx.Query("redirect_uri")
	ctx.Redirect(http.StatusFound, redirectUri)
}

func NewAuthConfiguration(db *database.Database) *Configuration {
	ctx := context.Background()
	providerURL := fmt.Sprintf("%s/auth/realms/cortex-gateway", os.Getenv("KEYCLOAK_PROVIDER_URL"))
	provider, err := oidc.NewProvider(ctx, providerURL)
	if err != nil {
		panic(err)
	}

	oidcConfig := &oidc.Config{ClientID: "cortex-gateway"}

	verifier := provider.Verifier(oidcConfig)

	return &Configuration{
		providerURL: providerURL,
		oidcConfig:  oidcConfig,
		verifier:    verifier,
		database: db,
		oauth2Config: struct {
			ClientID     string
			ClientSecret string
			Endpoint     oauth2.Endpoint
			RedirectURL  string
			Scopes       []string
		}{ClientID: oidcConfig.ClientID, ClientSecret: os.Getenv("CLIENT_SECRET"), Endpoint: provider.Endpoint(), RedirectURL: "http://localhost:8080/api/callback", Scopes: []string{oidc.ScopeOpenID, "email", "profile"}},
	}
}
