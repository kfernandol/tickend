
/* Default insert in Rol_PermissionLevels */
IF NOT EXISTS (SELECT 1 FROM Rol_PermissionsLevel)
BEGIN 
    INSERT INTO Rol_PermissionsLevel(Name, Level) VALUES('Administrador', 0)
END;

/* Default insert in Rol */
IF NOT EXISTS (SELECT 1 FROM Rol)
BEGIN 
    INSERT INTO Rol(Name, PermissionLevelId, Active) VALUES('Administrador', 1, 1)
END;

/* Default insert in Users */
IF NOT EXISTS (SELECT 1 FROM [User])
BEGIN 
    INSERT INTO [User](Username, FirstName, LastName, Password, Salt,  Email, Rol, Active) 
    VALUES('EBarillas', 'Edder','Barillas', 'jFQqrIMWUMGJEa8SWmYp5bsbhd/67y1JA5yRmXEqd1w=', 'kiFFKjUclHd03kvLDeRzLGa6XxJWYY+c8vzc6MdBfd4=', 'edderfernando20@gmail.com', 1, 1)/*Password default 123456*/


/* Default insert in Menu */
IF NOT EXISTS (SELECT 1 FROM [Menu])
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Users', 'user', '/users', NULL, 1, 1, 1)
END;

/* Default insert in MenuXRol */
IF NOT EXISTS (SELECT 1 FROM [MenuXRol])
BEGIN 
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(1,1)
END;

END