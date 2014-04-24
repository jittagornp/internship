/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.blogspot.na5cent.orm.repository;

import com.blogspot.na5cent.orm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author anonymous
 */
public interface UserRepository extends JpaRepository<User, Integer>{
    
}
