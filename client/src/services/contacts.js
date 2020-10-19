import axios from "axios"
const url = "/api/persons"

const getAll = () => {
  return axios.get(url)
    .then(response => response.data)
}

const create = contact => {
  return axios.post(url, contact)
    .then(response => response.data)
}

const update =  (id, contact) => {
  return axios.put(`${url}/${id}`, contact)
    .then(response => response.data)
}

const del = id => {
  return axios.delete(`${url}/${id}`)
    .then(response => response.data)
}

export default { getAll, create, update, del }
