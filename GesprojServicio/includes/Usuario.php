<?php

class Usuario{
    private $correo;
    private $nombre;
    private $apellidos;
    private $contrasenia;
    private $rol;


    public function __construct($correo,$nombre,$apellidos,$contrasenia,$rol)
    {
        $this->correo = $correo;
        $this->nombre = $nombre;
        $this->apellidos = $apellidos;
        $this->contrasenia= $contrasenia;
        $this->rol = $rol;
    }
    
    /**
     * zona de setters
     */
    public function setCorreo($correo): void{
        $this->correo = $correo;
    }
    public function setNombre($nombre):void{
        $this->nombre  = $nombre;
    }
    public function setApellidos($apellidos):void{
        $this->apellidos  = $apellidos;
    }
    public function setContrasenia($contrasenia):void{
        $this->contrasenia = $contrasenia;
    }
    public function setRol($rol):void{
        $this->rol= $rol;
    }
    /**
     * Zona de getters
     */

     public function getCorreo():string{
         return $this->correo;
     }
     public function getNombre():string{
         return $this->nombre;
     }
     public function getApellidos():string{
         return $this->apellidos;
     }
     public function getRol():int{
         return $this->rol;
     }
}