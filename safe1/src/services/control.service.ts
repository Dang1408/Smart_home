import { controlUrl } from '@/api/url';
import { Building, Device, Message, Request } from '@/models';
import store from '@/redux/store';
import actions from '@/redux/actions';

class ControlService {
  public ws?: WebSocket;

  connect = () => {
    this.ws = new WebSocket(controlUrl);
    store.dispatch(actions.setConnection(true));
    this.ws.onopen = this.init;
    this.ws.onmessage = (event: WebSocketMessageEvent) => {
      try {
        if (event.data) {
          console.log(event.data);
          this.handleMessage(JSON.parse(event.data) as Message);
        }
      } catch (err) {
        console.log(event.data);
      }
    };
    this.ws.onerror = (event: WebSocketErrorEvent) => {
      store.dispatch(actions.setConnection(false));
      this.ws?.close();
      console.error(`Error establishing Websocket: ${event.message}`);
    };
    this.ws.onclose = (event: WebSocketCloseEvent) => {
      store.dispatch(actions.setConnection(false));
      this.ws?.close();
      console.log(`Closing Websocket: ${event.message}`);
    };
  }

  init = () => {
    this.dispatchMessage({ 
      action: "init", 
      topic: "", 
      payload: store.getState().currentUser?.uid 
    });
  }

  sub = (building: Building) => {
    building.devices.forEach((device: Device) => {
      this.dispatchMessage({
        action: "sub",
        topic: device.topic,
        payload: ""
      })
    });
  }

  subOne = (device: Device) => {
    this.dispatchMessage({
      action: "sub",
      topic: device.topic,
      payload: ""
    });
  }

  unsub = (building: Building) => {
    building.devices.forEach((device: Device) => {
      this.dispatchMessage({
        action: "unsub",
        topic: device.topic,
        payload: ""
      })
    });
  }

  pub = (topic: string, msg: any) => {
    console.log(msg)
    this.dispatchMessage({
      action: "pub",
      topic: topic,
      payload: JSON.stringify(msg)
    });
  }

  handleMessage = (message: Message) => {
    store.dispatch(actions.updateData(message));
  }

  dispatchMessage = (request: Request) => {
    this.ws?.send(JSON.stringify(request));
  }

  close = () => {
    store.dispatch(actions.setConnection(false));
    this.ws?.close();
  }
};

export default new ControlService();