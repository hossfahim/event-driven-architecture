package main

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"strconv"
	"time"

	"github.com/segmentio/kafka-go"
)

type Order struct {
	OrderID   string  `json:"order_id"`
	UserID    string  `json:"user_id"`
	ItemID    string  `json:"item_id"`
	Amount    float64 `json:"amount"`
	UserEmail string  `json:"user_email"`
	Passwor   string  `json:"password"`
}

const (
	topic         = "orders"
	brokerAddress = "kafka:29092"
)

func main() {

	w := &kafka.Writer{
		Addr:     kafka.TCP(brokerAddress),
		Topic:    topic,
		Balancer: &kafka.LeastBytes{},
	}
	defer w.Close()

	log.Println("Producer started... (simulating new orders)")

	for {
		orderID := strconv.Itoa(rand.Intn(10000))
		userID := strconv.Itoa(rand.Intn(100))
		itemID := "ITEM-" + strconv.Itoa(rand.Intn(50))

		order := Order{
			OrderID:   orderID,
			UserID:    userID,
			ItemID:    itemID,
			Amount:    rand.Float64() * 100,
			UserEmail: "user" + userID + "@example.com",
		}

		orderJSON, err := json.Marshal(order)
		if err != nil {
			log.Printf("Failed to marshal order: %v\n", err)
			continue
		}

		msg := kafka.Message{
			Key:   []byte(order.OrderID),
			Value: orderJSON,
		}

		err = w.WriteMessages(context.Background(), msg)
		if err != nil {
			log.Printf("Failed to write message: %v\n", err)
		} else {
			log.Printf("Published Order: %s\n", order.OrderID)
		}

		time.Sleep(500 * time.Millisecond)
	}
}
