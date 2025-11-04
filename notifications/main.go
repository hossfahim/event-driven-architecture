package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/segmentio/kafka-go"
)

// Order defines the structure of our order event
type Order struct {
	OrderID   string `json:"order_id"`
	ItemID    string `json:"item_id"`
	UserEmail string `json:"user_email"`
	// Other fields omitted for brevity
	Password string 
	//Test field
	Test string
}

const (
	topic         = "orders"
	brokerAddress = "localhost:9092"
	groupID       = "email-group" // <-- Crucial: A *different* Group ID
)

func main() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:        []string{brokerAddress},
		Topic:          topic,
		GroupID:        groupID,
		MaxWait:        500 * time.Millisecond, // reduce wait before returning messages
		CommitInterval: time.Second,
	})
	defer r.Close()

	log.Println("Notification Service started...")

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Printf("Error reading message: %v\n", err)
			break
		}

		var order Order
		if err := json.Unmarshal(m.Value, &order); err != nil {
			log.Printf("Error unmarshaling JSON: %v\n", err)
			continue
		}

		// Simulate work (e.g., calling an email API)
		log.Printf("🔔 [Notification] Received Order %s. Sending confirmation to %s.\n", order.OrderID, order.UserEmail)
		time.Sleep(2 * time.Second) // Simulate slow email API
	}
}
