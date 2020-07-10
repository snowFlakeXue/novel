const initialState = {
    imgUrl:'',
    imgList:[],
    blogDetail:"",
    novelId:"".novelId,
    chapterId:"",
    isDraft:1,
    authorMenu:["/author/index"]

}
export default (state=initialState,action)=>{
    switch (action.type) {
        case 'GET_URL':{
            return{
                ...state,
                imgUrl:action.imgUrl
            }
        }
        case 'GET_IMG_LIST':{
            return{
                ...state,
                imgList:action.imgList
            }
        }
        case 'GET_BLOG_DETAIL':{
            return{
                ...state,
                blogDetail:action.blogDetail
            }
        }
        case 'GET_NOVEL_ID':{
            return{
                ...state,
                novelId:action.novelId
            }
        }
        case 'GET_CHAPTER_ID':{
            return{
                ...state,
                chapterId:action.chapterId
            }
        }
        case 'GET_AUTHOR_MENU':{
            return{
                ...state,
                authorMenu:action.authorMenu
            }
        }
        case 'SET_DRAFT':{
            return{
                ...state,
                isDraft:action.isDraft
            }
        }
       
        case 'REMOVE_URL':{
            return{
                ...state,
                imgUrl:null,
                imgList:[]
            }
        }
        default:
            return {...state};
    }
}