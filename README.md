# Smart_home

## Account Adafruit

Login to [Adafruit IO](https://io.adafruit.com) by these credentials

- **Username**: HoangDat3430
- **Password**: thaiduongkg113

## Create environment file

In file `adafruit.env` :

```
ADAFRUIT_BROKER=io.adafruit.com:1883
ADAFRUIT_USERNAME=HoangDat3430
ADAFRUIT_SECRET_KEY=$KEY #aio_GpTx271IjTtbdDPwxPwVJjkqKnk5
```

`$KEY` are the secret keys of IO Adafruit, login to my account with given credentials above and get the secret key (please don't generate new key). Because of security policy, if this key is published to github, IO Adafruit will automatically generate a new key.

## Build service Docker images

Run file `build-services.sh` in directory

```
$PATH-TO-SERVICES/build-services.sh
```

## Create docker volume that will be used by postgres

```
docker volume create --name=pgdata
```

## Compose up to run the containers

```
cd $PATH-TO-SERVICES
docker-compose up -d
```

## Shutdown all running services

```
docker-compose down
```

## Check database

In case you want to check the database, do as follow

```
docker exec -it $POSTGRES-CONTAINER-ID sh
> psql -U postgres
> \c smart_home

# Show the list of tables
> \dt

# Show the columns of a table
> \d+ table_name

> # Any SQL command to retrieve the data
```

## Backend services

- `smart_home_backend/data` is to handle the data and store/query from the PSQL. To understand more about this service, you can read the Golang source code `smart_home_backend/data` `.

- `smart_home_backend/connect` is the service between our application and Adafruit server, we connect to this service via **WebSocket** and it connects to the Adafruit via **MQTT**, through this service we receive messages from Adafruit as well as publishing messages back to server. To understand more about this service, you can read the Golang source code `smart_home_backend/connect`.

- `smart_home_backend/auto` is the automation service to automatically trigger protection mode of output devices. The client also does not communicate directly with this service. Instead they update the protection mode of each device to the data service, then `smart_home_backend/data` sends this information to the `smart_home_backend/auto`. Whenever gas or temperature exceeds the threshold, all output devices with configured protection mode will be triggered immediately.
- **NOTED:** Beside the automation service, we should also provide users (actually only building owners) ability to manually access and control their devices via user interface.

To read the logs of a Docker container, use this command

```
docker logs $CONTAINER_ID
```

## Backend APIs

    Use postman to test api

### Control service

The `smart_home_backend/connect` keeps connection between client and devices server, hence we can directly send message to the Adafruit via this services. The format of WS message is

```
Request {
  action: "init" | "pub" | "sub" | "unsub",
  topic: string,
  payload: string
};
```

Here we have total 4 actions

- `init` used immediately when WS connection is established, it sends the user id to `smart_home_backend/connect` to setup the MQTT connection with Adafruit server. `topic` and `payload` can be omitted here (just send empty string).
- `pub` used to publish the message to the Adafruit server with given `topic` and `payload`. Here `payload` must be same format as the messages defined in device interaction guidelines. -> User can publish a data value to turn off output device (output device don't turn off automatically) (Ex:`{"data":"B0","name":"Test buzzer"}` to turn off buzzer or `{"data":"L0","name":"Test led"}` for led ).
- `sub` used to subscribe a specified feed in the Adafruit server. Here `payload` can be omitted (just send empty string). -> connect to an input device (gas or temp)

- `unsub` used to unsubscribe a specified feed in the Adafruit server. Here `payload` can be omitted (just send empty string). -> unconnect to an input device (gas or temp)

### Data service

The Client communicates with this service via HTTP request, to do the stuffs related to database.

Some APIs:

```
POST /createUser
Payload: User
```

```
POST /createBuilding
Payload: Building
```

```
POST /closeBuilding
Payload:
  buildingName: string
```

```
POST /getUserBuildings
Payload:
  uid: string
```

```
POST /inviteUser
Payload:
  buildingName: string,
  email: string
```

```
POST /kickUser
Payload:
  buildingName: string,
  uid: string
```

```
POST /getInvitations
Payload:
  uid: string
```

```
POST /acceptInvitation
Payload:
  buildingName: string
  uid: string
```

```
POST /declineInvitation
Payload:
  buildingName: string
  uid: string
```

```
POST /addBuildingDevice
Payload:
  buildingName: string
  device: Device
```

```
POST /updateDeviceProtection
Payload:
  deviceName: string
  protection: boolean
  triggeredValue: string
```

_(Payloads are almost JSON type and the type defined in `smart_home_backend/data/models`)_
