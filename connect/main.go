package main

import "os"

func main() {
	a := App{}
	a.connectAdafruit(
		os.Getenv("ADAFRUIT_BROKER"),
		os.Getenv("ADAFRUIT_USERNAME"),
		os.Getenv("ADAFRUIT_SECRET_KEY"),
	)
	a.InitializeRoutes()
	////a.Run() in pipe
	a.Run_client(8010)
	////a.Run_pipe()
}
