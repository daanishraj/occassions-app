import { Occassion } from "../../../api/src/controllers/occassions.controller"
import Api from "./Api"

const route = "/occassions"

const getOccassions = async() : Promise<Occassion[]> => {
const response = await Api().get(route)
return response.data;
}

export default {
    getOccassions
}