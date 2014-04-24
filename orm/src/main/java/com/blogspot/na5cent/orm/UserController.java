/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.blogspot.na5cent.orm;

import com.blogspot.na5cent.orm.service.UserService;
import com.blogspot.na5cent.orm.util.JSFSpringUtils;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.faces.application.FacesMessage;
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

    private final UserService userService = JSFSpringUtils.getBean(UserService.class);

    @PostConstruct
    public void postContruct() {

    }
    
    public void reset(){
        users = userService.findAll();
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
        try {
            user = userService.save(user);
            showMessage(FacesMessage.SEVERITY_INFO, "save user", "success");
        } catch (Exception ex) {
            showMessage(FacesMessage.SEVERITY_ERROR, "save user", "fail");
        }
    }

    public void onSelectUser() {
        String userId = requestParam("userId");

        Integer id = Integer.valueOf(userId);
        int indexOf = this.getUsers().indexOf(new User(id));
        user = this.getUsers().get(indexOf);
    }

    public void onDelete() {
        this.getUsers().remove(user);

        showMessage(FacesMessage.SEVERITY_INFO, "delete user", "success");
    }

    private String requestParam(String paramName) {
        return FacesContext.getCurrentInstance()
                .getExternalContext()
                .getRequestParameterMap()
                .get(paramName);
    }

    private void showMessage(FacesMessage.Severity severity, String title, String body) {
        FacesContext.getCurrentInstance()
                .addMessage(null, new FacesMessage(severity, title, body));
    }
}
