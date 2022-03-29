package main

import "os"

func main() {
	a := App{}
	a.Initialize(
		os.Getenv("ADAFRUIT_BROKER"),
		os.Getenv("ADAFRUIT_USERNAME"),
		os.Getenv("ADAFRUIT_SECRET_KEY"),
	)
	a.Run(9010)
}
