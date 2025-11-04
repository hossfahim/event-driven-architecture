package main

import (
	"context"
	"encoding/json"
	"log"

	"github.com/segmentio/kafka-go"
)

// Order defines the structure of our order event
type Order struct {
	OrderID   string `json:"order_id"`
	ItemID    string `json:"item_id"`
	UserEmail string `json:"user_email"`
	// Other fields omitted for brevity
}

const (
	topic         = "orders"
	brokerAddress = "localhost:9092"
	groupID       = "inventory-group" // <-- Crucial: Unique Group ID
)

func main() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{brokerAddress},
		Topic:    topic,
		GroupID:  groupID, // Messages are distributed among consumers in the same group
		MinBytes: 10e3,    // 10KB
		MaxBytes: 10e6,    // 10MB
	})
	defer r.Close()

	log.Println("Inventory Service started...")

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

		// Simulate work
		log.Printf("📦 [INVENTORY] Received Order %s. Updating stock for item %s.\n", order.OrderID, order.ItemID)
		//time.Sleep(500 * time.Millisecond) // Simulate DB write
	}
}
