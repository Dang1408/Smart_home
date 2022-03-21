package main

import "os"

func main() {
	a := App{}
	a.ConnectPostgres(
		os.Getenv("PSQL_USERNAME"),
		os.Getenv("PSQL_PASSWORD"),
		os.Getenv("PSQL_DB_NAME"),
		os.Getenv("PSQL_HOSTNAME"),
	)
	a.InitializeRoutes()
	a.Run(8000)
}
