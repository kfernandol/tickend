
/* Default insert in Rol */
IF NOT EXISTS (SELECT 1 FROM Rol)
BEGIN 
    INSERT INTO Rol(Name, PermissionLevel, Active) VALUES('Administrador', 1, 1)
END;

/* Default insert in Users */
IF NOT EXISTS (SELECT 1 FROM [User])
BEGIN 
    INSERT INTO [User](Username, FirstName, LastName, Password, Salt,  Email, Rol, Active) 
    VALUES('EBarillas', 'Edder','Barillas', 'jFQqrIMWUMGJEa8SWmYp5bsbhd/67y1JA5yRmXEqd1w=', 'kiFFKjUclHd03kvLDeRzLGa6XxJWYY+c8vzc6MdBfd4=', 'edderfernando20@gmail.com', 1, 1)/*Password default 123456*/
END;

/* Default insert in Menu */
IF NOT EXISTS (SELECT 1 FROM [Menu])
BEGIN 
INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Security', 'security', '#', NULL, 1, 1, 1)

    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Users', 'pi-users', '/users', 1, 1, 1, 1)

    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Roles', 'pi-id-card', '/roles', 1, 2, 1, 1)

    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Menus', 'pi-th-large', '/menus', 1, 3, 1, 1)

    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Tickets', '', '#', NULL, 2, 1, 1)

    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('TicketTypes', 'pi pi-tags', '/ticket/types', 5, 2, 1, 1)

END;

/* Default insert in MenuXRol */
IF NOT EXISTS (SELECT 1 FROM [MenuXRol])
BEGIN 
    /* Users Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(2,1)

    /* Rol Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(3,1)

    /* Menus Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(4,1)
END;