import axios from "axios"
import { refs } from "./refs";

async function getImages(userRequest,page = 1){
    //без await, при виклику getImages, data повернув би Promise{<pending>}, а async await, каже, зачекай поки виповниться проміс, та поверне вже респонс(через бібліотеку у нас відразу дата у респонсі)
    const KEY = '33019590-ab19fb063f714cb66ad378ea8'
    const API = 'https://pixabay.com/api/'
        const response = await axios.get(`${API}?key=${KEY}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
        const data = response.data 
        refs.loadMore.classList.remove('is-hidden')
        // refs.loadMore.removeAttribute('hidden')

        return data
    }
 export {getImages}   