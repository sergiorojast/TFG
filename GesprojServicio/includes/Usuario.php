<?php

class Usuario
{
    private $correo;
    private $nombre;
    private $apellidos;
    private $contrasenia;
    private $rol;

    /**
     * Constructores
     */
    public function __construct()
    { }
    public function constructor($correo, $nombre, $apellidos, $contrasenia, $rol)
    {
        $this->correo = $correo;
        $this->nombre = $nombre;
        $this->apellidos = $apellidos;
        $this->contrasenia = $contrasenia;
        $this->rol = $rol;
    }
    public function constructorArray($array)
    {
        if (isset($array['pk_correo'])) {
            $this->correo = $array[0];
            
            $this->nombre = $array[1];
            $this->apellidos = $array[2];
            $this->contrasenia = $array[3];
            $this->rol = $array[4];
        }
    }

    /**
     * zona de setters
     */
    private function setCorreo($correo): void
    {
        $this->correo = $correo;
    }
    private function setNombre($nombre): void
    {
        $this->nombre  = $nombre;
    }
    private function setApellidos($apellidos): void
    {
        $this->apellidos  = $apellidos;
    }
    private function setContrasenia($contrasenia): void
    {
        $this->contrasenia = $contrasenia;
    }
    private function setRol($rol): void
    {
        $this->rol = $rol;
    }
    /**
     * Zona de getters
     */

    public function getCorreo(): string
    {
        return $this->correo;
    }
    public function getNombre(): string
    {
        return $this->nombre;
    }
    public function getApellidos(): string
    {
        return $this->apellidos;
    }
    public function getContrasenia()
    {
        return $this->contrasenia;
    }
    public function getRol(): int
    {
        return $this->rol;
    }

    public function __toString()
    {
        return "Correo->" . $this->correo . ", Nombre->" . $this->nombre . ", Apellidos->" . $this->apellidos . ", Rol->" . $this->rol;
    }
}
