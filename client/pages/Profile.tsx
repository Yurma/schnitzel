import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Post, Followers, ScrollTop } from '../components';
import { FollowersStore } from '../stores';

type ProfileProps = {
    match?: any;
    history?: any;
    ProfileStore?: any;
}

@inject("ProfileStore")
@observer
class Profile extends Component<ProfileProps> {
    componentWillMount() {
        let { profileName } = this.props.match.params;
        window.addEventListener('scroll', this.props.ProfileStore.handleScroll);
        if (this.props.match.path === "/post/:postId/1") return;
        if (this.props.match.path === "/profile") profileName = this.props.ProfileStore.userData.username;
        this.props.ProfileStore.componentMounted(profileName, () => {
            if (this.props.ProfileStore.myProfile && profileName) this.props.history.push("/profile");
        });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.props.ProfileStore.handleScroll);
        this.props.ProfileStore.destroy();
    }

    componentDidUpdate(prevProps) {
        let { profileName } = this.props.match.params;
        if(this.props.match.path === "/profile") profileName = this.props.ProfileStore.userData.username;
        //window.removeEventListener('scroll', this.props.ProfileStore.handleScroll);
        //if (this.props.match.path !== prevProps.match.path && (prevProps.match.path == "/post/:postId/1" || this.props.match.path == "/post/:postId/1") && this.props.ProfileStore.profileId) return;
        if (this.props.ProfileStore.profileData && profileName && profileName !== prevProps.match.params.profileName && this.props.ProfileStore.profileData.username !== profileName ) {
            this.props.ProfileStore.componentMounted(profileName, () => {
                if (this.props.ProfileStore.myProfile && profileName) this.props.history.push("/profile");
            });
            //window.addEventListener('scroll', this.props.ProfileStore.handleScroll);
        }
    }

    render() {
        return <> <div onScroll={this.props.ProfileStore.handleScroll}>{!this.props.ProfileStore.isLoading && <>
            { this.props.ProfileStore.validProfile ? 
            <div>
                <div>
                    <div className="profile-image mx-auto text-center">{this.props.ProfileStore.profileData.hasPhoto ? <img src={this.props.ProfileStore.profileData.url} className="card-img-top" /> : <img src="https://storage.googleapis.com/schnitzel/default.jpg" className="card-img-top" />}</div>
                    <div className="mx-auto text-center">
                        <div className="profile-info h4"><span>Followers: {this.props.ProfileStore.profileData.followerNum} </span> <span>Posts: {this.props.ProfileStore.profileData.postNum} </span> <span>Points: {this.props.ProfileStore.profileData.points} </span></div>
                    {this.props.ProfileStore.isAuth && 
                    <>
                        <ul className="d-inline-block m-3 text-left">
                            <button className="btn btn-blue-transparent btn-rounder border-blue d-inline-block" onClick={this.props.ProfileStore.toggleFollowers}>Followers</button>
                            { this.props.ProfileStore.showFollowers &&
                                <Followers 
                                    type="followers" 
                                    store={new FollowersStore(this.props.ProfileStore.getFollowers, this.props.ProfileStore.profileData.id)}
                                    exitScreen={this.props.ProfileStore.toggleFollowers} 
                                />
                            }
                        </ul>
                        <ul className="d-inline-block m-3 text-left">
                            <button className="btn btn-blue-transparent btn-rounder border-blue" onClick={this.props.ProfileStore.toggleFollowing}>Following</button>
                            { this.props.ProfileStore.showFollowing &&
                                <Followers 
                                    type="following" 
                                    store={new FollowersStore(this.props.ProfileStore.getFollowing, this.props.ProfileStore.profileData.id)}
                                    exitScreen={this.props.ProfileStore.toggleFollowing} 
                                />
                            }
                        </ul>
                    </>
                    }
                    </div>
                    { (this.props.ProfileStore.isAuth && !this.props.ProfileStore.myProfile) && <>{
                        this.props.ProfileStore.profileData.isFollowing
                        ?   <div className="mx-auto text-center">
                                <button className="btn btn-orange btn-rounder px-11 folbtn" onClick={this.props.ProfileStore.unfollowClick}>Unfollow</button>
                            </div>
                        :   <div className="mx-auto text-center">
                                <button className="btn btn-lightgreen btn-rounder folbtn" onClick={this.props.ProfileStore.followClick}>Follow</button>
                            </div>
                    }</>}
                    <div>
                        <h1 className="text-center">{this.props.ProfileStore.profileData.username}</h1>
                    </div>
                    { (this.props.ProfileStore.myProfile || !this.props.ProfileStore.isPrivate) 
                        ?  <div className="posts">
                            {this.props.ProfileStore.loadingPost 
                            ? <>
                            <div className="posts-placeholder card col-9 my-6">
                              <div className="text-placeholder my-4 mx-1"></div>
                              <div className="title-placeholder my-4 mx-1"></div>
                              <div className="description-placeholder my-2 mx-1"></div>
                              <div className="description-placeholder my-2 mx-1"></div>
                              <div className="description-placeholder my-2 mx-1"></div>
                            </div>
                            <div className="posts-placeholder card col-9 my-6">
                              <div className="text-placeholder my-4 mx-1"></div>
                              <div className="title-placeholder my-4 mx-1"></div>
                              <div className="description-placeholder my-2 mx-1"></div>
                              <div className="description-placeholder my-2 mx-1"></div>
                              <div className="description-placeholder my-2 mx-1"></div>
                            </div>
                            </>
                            : <>{this.props.ProfileStore.posts.map((post, key) => <Post
                                post={post} 
                                key={key} 
                                iter={key} 
                                userdata={this.props.ProfileStore.userData}
                                togglePoint={this.props.ProfileStore.togglePoint}
                                authUser={this.props.ProfileStore.userData.id} 
                                removePost={this.props.ProfileStore.removePost}
                                isAuth={this.props.ProfileStore.isAuth}
                                from="profile" 
                            />)}</>
                            }</div>
                        :   <div className="mx-auto text-center my-5 h2">This profile is private.</div>
                    } { !this.props.ProfileStore.isPrivate && <>{ this.props.ProfileStore.last 
                    ?   <div className="text-center f2 mb-8">There are no more posts to load. <br /> 
                        <Link to="/explore" className="btn btn-blue btn-rounder f3">Explore</Link> to find new posts</div> 
                    :   <div className="text-center f2 mb-8">
                            <button className="btn btn-blue btn-squared p-4" onClick={this.props.ProfileStore.handleScroll}>Load more posts</button>
                        </div>
                    } </> }
                </div>
            </div>
            : <div className="mx-auto text-center my-10 h2">User could not be found.</div>
        }</> }
        </div>
            { this.props.ProfileStore.isScrolled &&
                <ScrollTop />
            }
        </>
    }
}

export default withRouter(Profile);