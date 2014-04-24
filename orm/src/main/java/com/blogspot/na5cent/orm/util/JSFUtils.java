/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.blogspot.na5cent.orm.util;

import javax.faces.context.FacesContext;
import javax.servlet.ServletContext;
import org.springframework.web.jsf.FacesContextUtils;

/**
 *
 * @author anonymous
 */
public class JSFUtils {

    public static ServletContext getServletContext() {
        return FacesContextUtils
                .getRequiredWebApplicationContext(FacesContext.getCurrentInstance())
                .getServletContext();
    }
}
