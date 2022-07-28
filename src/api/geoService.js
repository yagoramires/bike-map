import axios from 'axios';

export default class geoService {
  static getNetworks() {
    return axios(`//api.citybik.es/v2/networks`);
  }
  static getStations(href) {
    return axios(`//api.citybik.es${href}`);
  }
}
// importa os dados da api
