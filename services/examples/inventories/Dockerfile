# ----- Stage 1: Build -----
# Use the official Go image as the builder
FROM golang:1.25-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the go.mod and go.sum files from the *root* directory
# (one level up from this Dockerfile)
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code for this specific service
# (e.g., just the producer/main.go)
COPY . .

# Build the Go application, disabling CGO
# -o /app/server creates a binary named "server"
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server .

# ----- Stage 2: Final Image -----
# Use a minimal Alpine Linux image
FROM alpine:latest

WORKDIR /app

# Copy *only* the compiled binary from the 'builder' stage
COPY --from=builder /app/server .

# Run the binary when the container starts
CMD ["./server"]
