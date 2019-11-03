<?php

/**
 * Clase encargada de gestionar la base de datos 
 */

class ConectorBD
{

    private $servidor = 'localhost';
    private $usuario = 'root';
    private $pass = '';
    private $bd = 'GesProj';

    //variable que almacenara el objeto pdo.
    private $conexion;



    public function __construct()
    {
        try {
            //definimos la direccion y parametros de la conexion
            $Dbd  = "mysql:host=" . $this->servidor . ";dbname=" . $this->bd;

            //creamos la instancia del pdo
            $this->conexion = new PDO($Dbd, $this->usuario, $this->pass);


            // echo "conexion realizada con exito";
        } catch (PDOException $exc) {
            echo $exc->getMessage();
        }
    }

    public function __destruct()
    {
        $this->conexion = null;
    }

    public function cerrarBD(): void
    {
        $this->conexion  = null;
        //echo ' <br>Base de datos cerrada';
    }

    /**
     * Funcion llamada para actualizar la base de datos, o insertar 
     * @param $consulta 
     * @return boolean | $consulta;
     */
    public function actualizarBD($consulta)
    {
        return $this->conexion->query($consulta);
    }
    public function consultarBD($consulta)
    {
        return $this->conexion->query($consulta);
     }
}
