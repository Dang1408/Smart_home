package main

import "os"

func main() {
	a := App{}
	a.SetupAdafruitConfig(
		os.Getenv("ADAFRUIT_BROKER"),
		os.Getenv("ADAFRUIT_USERNAME"),
		os.Getenv("ADAFRUIT_SECRET_KEY"),
	)
	a.InitializeRoutes()
	a.Run(8010)
}
