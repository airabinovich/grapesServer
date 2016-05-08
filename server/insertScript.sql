insert into campos (idCampo,uuid) values (1,"1");
insert into duenios (idDuenio,nombre,apellido,dni,idUsuario) (select 1,"Ariel","Rabinovich",36111111,(select idUsuario from usuarios where username="ariel"));
insert into campoperteneceaduenio (idCampo,idDuenio,desde,hasta) values(1,1,now(),null);
insert into sensores (idSensor,idCampo,address) values(1,1,null);