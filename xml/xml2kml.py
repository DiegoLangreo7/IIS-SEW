# -*- coding: utf-8 -*-
import xml.etree.ElementTree as ET

def verXML(archivoXML):
    """Visualiza por pantalla un archivo XML mostrando:
        - El elemento raíz con su contenido y sus atributos
        - Todos los elementos con su contenido y los valores de sus atributos
    """
    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print('No se encuentra el archivo ', archivoXML)
        exit()
    except ET.ParseError:
        print("Error procesando el archivo XML = ", archivoXML)
        exit()

    raiz = arbol.getroot()
    print("\nElemento raíz = ", raiz.tag)

    if raiz.text is not None:
        print("Contenido = ", raiz.text.strip('\n'))
    else:
        print("Contenido = ", raiz.text)

    print("Atributos = ", raiz.attrib)

    for hijo in raiz.findall('.//'):
        print("\nElemento = ", hijo.tag)
        if hijo.text is not None:
            print("Contenido = ", hijo.text.strip('\n'))
        else:
            print("Contenido = ", hijo.text)
        print("Atributos = ", hijo.attrib)

def extraer_coordenadas(archivoXML):
    """Extrae coordenadas de los tramos del archivo XML de Monza"""
    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print('No se encuentra el archivo ', archivoXML)
        exit()
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivoXML)
        exit()

    raiz = arbol.getroot()
    ns = {'uni': 'http://www.uniovi.es'}
    coordenadas = []

    for tramo in raiz.findall('.//uni:tramos', ns):
        sector = tramo.find('uni:sector', ns).text
        for coord in tramo.findall('.//uni:coordenadas', ns):
            longitud = coord.find('uni:longitud', ns).text
            latitud = coord.find('uni:latitud', ns).text
            altitud = coord.find('uni:altitud', ns).text
            coordenadas.append((sector, longitud, latitud, altitud))

    return coordenadas

class Kml(object):
    """Genera archivo KML con puntos y líneas"""
    def __init__(self):
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz, 'Document')

    def addPlacemark(self, nombre, descripcion, long, lat, alt, modoAltitud):
        pm = ET.SubElement(self.doc, 'Placemark')
        ET.SubElement(pm, 'name').text = '\nSector ' + nombre + '\n'
        ET.SubElement(pm, 'description').text = '\n' + descripcion + '\n'
        punto = ET.SubElement(pm, 'Point')
        ET.SubElement(punto, 'coordinates').text = '\n{},{},{}\n'.format(long, lat, alt)
        ET.SubElement(punto, 'altitudeMode').text = '\n' + modoAltitud + '\n'

    def addLineString(self, nombre, extrude, tesela, listaCoordenadas, modoAltitud, color, ancho):
        pm = ET.SubElement(self.doc, 'Placemark')
        ET.SubElement(pm, 'name').text = '\n' + nombre + '\n'
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls, 'extrude').text = '\n' + extrude + '\n'
        ET.SubElement(ls, 'tessellation').text = '\n' + tesela + '\n'
        ET.SubElement(ls, 'coordinates').text = '\n' + listaCoordenadas + '\n'
        ET.SubElement(ls, 'altitudeMode').text = '\n' + modoAltitud + '\n'

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement(linea, 'color').text = '\n' + color + '\n'
        ET.SubElement(linea, 'width').text = '\n' + ancho + '\n'

    def escribir(self, nombreArchivoKML):
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

def main():
    """Función principal para visualizar XML y crear el archivo KML"""
    print(verXML.__doc__)

    miArchivoXML = input('Introduzca un archivo XML = ')
    verXML(miArchivoXML)

    coordenadas = extraer_coordenadas(miArchivoXML)
    print("\nCoordenadas extraídas:")
    for coord in coordenadas:
        print(coord)

    nuevoKML = Kml()
    lista_coordenadas = []
    for coord in coordenadas:
        sector, longitud, latitud, altitud = coord
        nuevoKML.addPlacemark(sector, 'Tramo del sector {}'.format(sector), longitud, latitud, altitud, 'relativeToGround')
        lista_coordenadas.append('{},{},{}'.format(longitud, latitud, altitud))

    if lista_coordenadas:
        coordenadas_linea = ' '.join(lista_coordenadas)
        nuevoKML.addLineString('Ruta Unida', '1', '1', coordenadas_linea, 'relativeToGround', 'ff0000ff', '2')

    nombreKML = input('Introduzca el nombre del archivo KML (con la extensión .kml) = ')
    nuevoKML.escribir(nombreKML)
    print("Creado el archivo: ", nombreKML)

if __name__ == "__main__":
    main()
