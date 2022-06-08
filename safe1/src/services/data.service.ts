import { dataUrl } from '@/api/url';
import HttpService from '@/services/http.service';
import { Building, Device, User } from '@/models';

class DataService {
  createUser(payload: User): Promise<User | null> {
    return HttpService.post(`${dataUrl}/createUser`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as User : null)
      .catch(err => { console.error(err); return null });
  }
  getUser(payload: any): Promise<User | null> {
    return HttpService.post(`${dataUrl}/getUser`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as User : null)
      .catch(err => { console.error(err); return null });
  }
  createBuilding(payload: Building): Promise<Building | null> {
    return HttpService.post(`${dataUrl}/createBuilding`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Building : null)
      .catch(err => { console.error(err); return null });
  }

  closeBuilding(payload: any): Promise<any | null> {
    return HttpService.post(`${dataUrl}/closeBuilding`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Building : null)
      .catch(err => { console.error(err); return null });
  }

  getUserBuildings(payload: any): Promise<Building[] | null> {
    return HttpService.post(`${dataUrl}/getUserBuildings`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Building[] : null)
      .catch(err => { console.error(err); return null });
  }

  inviteUser(payload: any): Promise<any | null> {
    return HttpService.post(`${dataUrl}/inviteUser`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .catch(err => { console.error(err); return null });
  }

  kickUser(payload: any): Promise<any | null> {
    return HttpService.post(`${dataUrl}/kickUser`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .catch(err => { console.error(err); return null });
  }

  getInvitations(payload: User): Promise<Building[] | null> {
    return HttpService.post(`${dataUrl}/getInvitations`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Building[] : null)
      .catch(err => { console.error(err); return null });
  }

  acceptInvitation(payload: any): Promise<Building | null> {
    return HttpService.post(`${dataUrl}/acceptInvitation`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Building : null)
      .catch(err => { console.error(err); return null });
  }

  declineInvitation(payload: any): Promise<any | null> {
    return HttpService.post(`${dataUrl}/declineInvitation`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .catch(err => { console.error(err); return null });
  }

  addBuildingDevice(payload: any): Promise<Device | null> {
    return HttpService.post(`${dataUrl}/addBuildingDevice`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Device : null)
      .catch(err => { console.error(err); return null });
  }

  updateDeviceProtection(payload: any): Promise<Device | null> {
    return HttpService.post(`${dataUrl}/updateProtection`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Device : null)
      .catch(err => { console.error(err); return null });
  }

  getOutputDevices(payload: any): Promise<Device[] | null> {
    return HttpService.post(`${dataUrl}/getOutputDevices`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Device[] : null)
      .catch(err => { console.error(err); return null });
  }

  getInputDevices(payload: any): Promise<Device[] | null> {
    return HttpService.post(`${dataUrl}/getInputDevices`, payload)
      .then(response => response.status === 200 ? response.json() : null)
      .then(json => json !== null ? json as Device[] : null)
      .catch(err => { console.error(err); return null });
  }

  ping() {
    HttpService.get(`${dataUrl}/ping`)
      .then(response => response.text())
      .then(text => console.log(text))
      .catch(err => console.error(err));
  }
};

export default new DataService();