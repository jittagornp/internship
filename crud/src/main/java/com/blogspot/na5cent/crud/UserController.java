/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.blogspot.na5cent.crud;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;

/**
 *
 * @author anonymous
 */
@ManagedBean
@SessionScoped
public class UserController implements Serializable {

    private List<User> users;
    private User user;

    @PostConstruct
    public void postContruct() {
        user = new User();
        user.setId(1);
        user.setName("jittagorn pitakmetagoon");
        user.setEmail("jittagornp@gmail.com");
        user.setPhone("084-769-5002");

        this.getUsers().add(user);
    }

    public void onCreateUser() {
        user = new User();
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<User> getUsers() {
        if (users == null) {
            users = new ArrayList<>();
        }

        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public void onSave() {
        user.setId(this.getUsers().size() + 1);
        this.getUsers().add(user);
    }

    public void onSelectUser() {
        String userId = FacesContext.getCurrentInstance()
                .getExternalContext()
                .getRequestParameterMap()
                .get("userId");

        Integer id = Integer.valueOf(userId);
        int indexOf = this.getUsers().indexOf(new User(id));
        user = this.getUsers().get(indexOf);
    }
    
    public void onDelete(){
        this.getUsers().remove(user);
    }
}
