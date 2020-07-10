import React, { Component } from 'react';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom'
import App from './App'
import Backstage from './backstage'
import AuthorManagement from './controllerPage/author'
import Categories from './controllerPage/categories'
import Register from './page/register'
import Login from './page/login'
import Home from './home'
import FrontBanner from './controllerPage/frontBanner'
import BlogEdit from './controllerPage/blogEdit'
import BlogManagement from './controllerPage/blog'
import BackLogin from './page/backLogin'
import UserManage from './controllerPage/user'
import RoleManage from './controllerPage/role'
import PermissionManage from './controllerPage/permission'
import MenuManage from './controllerPage/menu'
import AuthorLogin from './page/authorLogin'
import AuthorStage from './authorStage'
import AuthorIndex from './author/index'
import AuthorInfo from './author/baseInfo'
import AuthorPwd from './author/password'
import AuthorBase from './author/base'
import AuthorNotice from './author/notice'
import NoticeDetail from './author/noticeDetail';
import BookList from './author/bookList'
import BookInfo from './author/bookInfo'
import CreateBookInfo from './author/createBookInfo'
import UploadChapter from './author/uploadChapter'
import BookManage from './author/bookManage'
import Draft from './author/draft'
import ChapterManage from './author/chapterManage'
import BackHome from './controllerPage/backHome'
import NoticeManage from './controllerPage/notice'
import NotFound from './404'
import NovelControl from './controllerPage/novelCotroller'
import ChapterController from './controllerPage/chapter-control'
class Router extends Component {
    render() {
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route path='/sso/blog-edit' exact component={BlogEdit} />
                        <Route path='/404'  component={NotFound} />
                       
                        <Route path="/cms" render={() =>
                            <Backstage>
                                <Switch>
                                    <Route path='/cms/author' exact component={AuthorManagement} />
                                    <Route path='/cms/categories' exact  component={Categories} />
                                    <Route path='/cms/front-banner' exact component={FrontBanner} />
                                    <Route path='/cms/blog' exact component={BlogManagement} />
                                    <Route path='/cms/notice' exact component={NoticeManage} />
                                    <Route path='/cms/novel' exact component={NovelControl} />
                                    <Route path='/cms/chapter' exact component={ChapterController} />

                                    {/* <Redirect to='/sso/author' /> */}
                                    <Redirect to='/404' />

                                </Switch>
                            </Backstage>
                        } />
                        <Route path="/acl" render={() =>
                            <Backstage>
                                <Switch>
                                    <Route path='/acl/home' component={BackHome} />
                                    <Route path='/acl/user' component={UserManage} />
                                    <Route path='/acl/role' component={RoleManage} />
                                    <Route path='/acl/permission' component={PermissionManage} />
                                    <Route path='/acl/menu' component={MenuManage} />
                                    <Redirect to='/404' />
                                    {/* <Redirect to='/sso/author' /> */}
                                </Switch>
                            </Backstage>
                        } />
                        
                        <Route path="/author" render={() =>
                            <AuthorStage>
                                <Switch>
                                    <Route path='/author/index' component={AuthorIndex} />
                                    <Route path='/author/notice' component={AuthorNotice} />
                                    <Route path='/author/noticeDetail/:id' component={NoticeDetail} />
                                    <Route path='/author/book-manage' component={BookList} />
                                    <Route exact path='/author/book-manage/upload/:id' component={CreateBookInfo} />
                                    <Route path='/author/book-info' render={()=>
                                        <BookManage>
                                            <Switch>
                                            <Route exact path='/author/book-info/upload-chapter/:id' component={UploadChapter} />
                                            <Route exact path='/author/book-info/draft/:id' component={Draft} />
                                            <Route exact path='/author/book-info/:id' component={BookInfo} />
                                            <Route exact path='/author/book-info/chapter-manage/:id' component={ChapterManage} />
                                            </Switch>
                                        </BookManage>
                                    } />
                                    <Route path='/author/base' render={() =>
                                        <AuthorInfo>
                                            <Switch>
                                                <Route path='/author/base/info' component={AuthorBase} />
                                                <Route path='/author/base/password' component={AuthorPwd} />
                                            </Switch>
                                        </AuthorInfo>
                                    } />
                                    <Redirect to='/404' />
                                </Switch>
                            </AuthorStage>
                        } />
                        <Route path='/'  render={() =>
                            <Home>
                                <Route path='/register' exact component={Register} />
                                <Route path='/login' exact component={Login} />
                                <Route path='/backLogin' exact component={BackLogin} />
                                <Route path='/authorLogin' exact component={AuthorLogin} />
                                {/* <Redirect to='/backLogin' /> */}
                               
                            </Home>
                        } />
                    </Switch>
                    
                </App>
            </HashRouter>
        );
    }
}

export default Router;