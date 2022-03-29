# Source: https://codefresh.io/docs/docs/learn-by-example/golang/golang-hello-world/

FROM golang:1.18-alpine AS build_base

RUN apk add --no-cache git

# Set the Current Working Directory inside the container
WORKDIR /tmp/services/connect

# We want to populate the module cache based on the go.{mod,sum} files.
COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

# Unit tests
# RUN CGO_ENABLED=0 go test -v

# Build the Go app
RUN go build -o ./out/connect .

# Start fresh from a smaller image
FROM alpine:3.13
RUN apk add ca-certificates

COPY --from=build_base /tmp/services/connect/out/connect /app/services/connect

# This container exposes port 8080 to the outside world
EXPOSE 8010

# Run the binary program produced by `go install`
CMD ["/app/services/connect"]