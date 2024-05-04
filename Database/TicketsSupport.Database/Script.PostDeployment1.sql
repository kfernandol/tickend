/*
Post-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.		
 Use SQLCMD syntax to include a file in the post-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the post-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/



/* Default inserts in Rol table */
IF NOT EXISTS (SELECT 1 FROM Rol WHERE Name = 'Administrator')
BEGIN 
    INSERT INTO Rol(Name, PermissionLevel, Active) VALUES('Administrador', 1, 1)
END;

/* Default inserts in Users table */
IF NOT EXISTS (SELECT 1 FROM [User] WHERE Username = 'EBarillas')
BEGIN 
    INSERT INTO [User](Username, FirstName, LastName, Password, Salt,  Email, Rol, Active) 
    VALUES('EBarillas', 'Edder','Barillas', 'jFQqrIMWUMGJEa8SWmYp5bsbhd/67y1JA5yRmXEqd1w=', 'kiFFKjUclHd03kvLDeRzLGa6XxJWYY+c8vzc6MdBfd4=', 'edderfernando20@gmail.com', 1, 1)/*Password default 123456*/
END;

/* Default inserts in Menu table */
IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Security')
BEGIN 
INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Security', 'security', '#', NULL, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Users')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Users', 'pi-users', '/Users', 1, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Roles')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Roles', 'pi-id-card', '/Roles', 1, 2, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Menus')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Menus', 'pi-th-large', '/Menus', 1, 3, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'ProjectsP')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('ProjectsP', '', '#', NULL, 2, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Projects')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Projects', 'pi pi-copy', '/Projects', 5, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'TicketsP')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('TicketsP', '', '#', NULL, 3, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'Tickets')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('Tickets', 'pi pi-ticket', '/Tickets', 7, 1, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'TicketTypes')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('TicketTypes', 'pi pi-tags', '/Ticket/Types', 7, 2, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'TicketStatus')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('TicketStatus', 'pi pi-sliders-h', '/Ticket/Status', 7, 3, 1, 1)
END;

IF NOT EXISTS (SELECT 1 FROM [Menu] WHERE Name = 'TicketPriority')
BEGIN 
    INSERT INTO [Menu](Name,  Icon, Url, ParentId, Position, Show, Active) 
    VALUES('TicketPriority', 'pi pi-sort-amount-up', '/Ticket/Priorities', 7, 4, 1, 1)
END;

/* Default insert in MenuXRol */
IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 2)
BEGIN 
    /* Users Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(2,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 3)
BEGIN 
    /* Rol Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(3,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 4)
BEGIN 
    /* Menus Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(4,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 6)
BEGIN 
    /* Projects Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(6,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 8)
BEGIN 
    /* Tickets Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(8,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 9)
BEGIN 
    /* Tickets Type Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(9,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 10)
BEGIN 
    /* Tickets Status Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(10,1)
END;

IF NOT EXISTS (SELECT 1 FROM [MenuXRol] WHERE MenuId = 11)
BEGIN 
    /* Tickets Priorities Menu */
    INSERT INTO [MenuXRol](MenuId, RoleId) 
    VALUES(11,1)
END;