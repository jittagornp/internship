/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.blogspot.na5cent.orm.service;

import com.blogspot.na5cent.orm.User;
import java.util.List;

/**
 *
 * @author anonymous
 */
public interface UserService {
    
    public User save(User user);
    
    public List<User> findAll();
}
