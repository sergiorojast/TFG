<?php

class Usuario
{
    private $correo ="";
    private $nombre ="";
    private $apellidos="";
    private $contrasenia="";
    private $rol= 0;
    private $imagen ="";

    /**
     * Constructores
     */
    public function __construct()
    { }
    public function constructor($correo, $nombre, $apellidos, $imagen, $contrasenia, $rol)
    {
        $this->correo = $correo;
        $this->nombre = $nombre;
        $this->apellidos = $apellidos;
        $this->imagen =  $imagen;
        $this->contrasenia = $contrasenia;
        $this->rol = $rol;
    }
    public function constructorArray($array)
    {
        if (isset($array['pk_correo'])) {
            $this->correo = $array[0];

            $this->nombre = $array[1];
            $this->apellidos = $array[2];
            $this->imagen = $array[3];
            $this->contrasenia = $array[4];
            $this->rol = $array[5];
        }
    }

    /**
     * zona de setters
     */
    public function setCorreo($correo): void
    {
        $this->correo = $correo;
    }
    public function setNombre($nombre): void
    {
        $this->nombre  = $nombre;
    }
    public function setApellidos($apellidos)
    {
        $this->apellidos  = $apellidos;
    }
    public function setContrasenia($contrasenia): void
    {
        $this->contrasenia = $contrasenia;
    }
    public function setRol($rol): void
    {
        $this->rol = $rol;
    }
    public function setImagen($imagen)
    {
        $this->imagen = $imagen;
    }
    /**
     * Zona de getters
     */

    public function getCorreo()
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
    public function getImagen()
    {
        return $this->imagen;
    }

    public function devolverDatosArray()
    {
        $resultado = [
            'correo'=>$this->correo,
            'nombre'=>$this->nombre,
            'apellidos'=>$this->apellidos,
            'imagen'=>$this->imagen,
            'rol'=>$this->rol,
        ];

        return $resultado;
    }

    /*  public function __toString()
   {
   return "Correo->" . $this->correo . ", Nombre->" . $this->nombre . ", Apellidos->" . $this->apellidos . ", Rol->" . $this->rol;
    } */
}
