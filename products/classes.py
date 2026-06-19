from .models import *



# PANELES =====================================================================================
def paneles(total_consumo_productos):
    print("Paneles=====================")
    paneles=list(SolarPanel.objects.all().values())
    paneles=sorted(paneles, key=lambda panel: panel["production"],reverse=False)
    panel_apropiado=0
    contador_paneles=0
    total_consumo_productos=total_consumo_productos+200
    while panel_apropiado==0:
        contador_paneles +=1
        for p in paneles:
            pdrocuccion=(p["production"]*4)*contador_paneles
            if pdrocuccion>=total_consumo_productos:
                panel_apropiado=p
                break
    panel_need={
        "amount": contador_paneles,
        "production": {
        "production_hr":panel_apropiado["production"] ,
        "production_day":panel_apropiado["production"]*4 ,
        "total_production_day": pdrocuccion
    },
    "name": panel_apropiado["name"],
    "price": panel_apropiado["price"],
    }
    return panel_need,panel_apropiado,contador_paneles


# BATERIAS =====================================================================================

def baterias(total_consumo_productos,voltage_sistema):
    # traer una lista de todas las baterias
    baterias=list(Battery.objects.all().values())
    bateria_apropiada=0
    contardor_baterias=0
    baterias=sorted(baterias, key=lambda bateria: bateria["capacity"],reverse=False)
    while bateria_apropiada==0:
        contardor_baterias +=1
        for b in baterias:
            capacidad=b["capacity"]*voltage_sistema*contardor_baterias
            print(b,"bateria ====================== ",capacidad, Voltage.objects.get(id=b["voltage_id"]).voltage,total_consumo_productos*2,contardor_baterias)
            if Voltage.objects.get(id=b["voltage_id"]).voltage==12 and capacidad>=total_consumo_productos*2 :
                bateria_apropiada=b
                break
    if voltage_sistema==24:
        contardor_baterias *=2
    bateria_apropiada={
        "amount": contardor_baterias,
        "capacity": capacidad,
        "name": bateria_apropiada["name"],
        "price": bateria_apropiada["price"],
    }
    return bateria_apropiada


#REGULADOR =====================================================================================
def regulador(amp_requerido):
    reguladores=list(Reguladores.objects.all().values())
    reguladores=sorted(reguladores, key=lambda regulador: regulador["amperios"],reverse=False)
    regulador_apropiado=0
    
    print(amp_requerido,"amp_requerido")
    for r in reguladores:
            if r["amperios"]>=amp_requerido:
                regulador_apropiado=r
                break
    if regulador_apropiado==0:
        regulador_apropiado=reguladores[-1]
    regulador_apropiado={
        "amount": 1,
        "name": regulador_apropiado["name"],
        "price": regulador_apropiado["price"],
    }
    return regulador_apropiado


#BREAKER =====================================================================================
def breaker(amp_requerido):
    breakers=list(Breakers.objects.all().values())
    breakers=sorted(breakers, key=lambda breaker: breaker["amps"],reverse=False)
    breaker_apropiado=0
    for be in breakers:
        if be["amps"]>=amp_requerido:
            breaker_apropiado=be
            break
    if breaker_apropiado==0:
        breaker_apropiado=breakers[-1]
    breaker_apropiado={
        "amount": 3,
        "name": breaker_apropiado["name"],
        "price": breaker_apropiado["price"],    
    }
    return breaker_apropiado

# CABLES ENCAUCHETADOS =====================================================================================
def cables_encauchetados(amp_requerido):
        cables_encauchetados=list(RubberizedCables.objects.all().values())
        cables_encauchetados=sorted(cables_encauchetados, key=lambda cable: cable["supported_amperage"],reverse=False)
        cable_encauchetado_apropiado=0
        
        for c in cables_encauchetados:
            if c["supported_amperage"]>=amp_requerido:
                cable_encauchetado_apropiado=c
                break
        if cable_encauchetado_apropiado==0:
            cable_encauchetado_apropiado=cables_encauchetados[-1]
        cable_encauchetado_apropiado={
            "amount": 10,
            "name": cable_encauchetado_apropiado["name"],
            "price": cable_encauchetado_apropiado["price"],
        }
        return cable_encauchetado_apropiado

  # SOPORTES DE PANEL =====================================================================================
        
def Soporte_panel(contador_paneles):
        soporte_panel=list(PanelSupports.objects.all().values())
        soporte_panel={
            "amount": contador_paneles,
            "name": soporte_panel[0]["name"],
            "price": soporte_panel[0]["price"],
        }
        return soporte_panel

    # MODULO CENTRALIZADO =====================================================================================
        
def Modulo_centralizado():
        modulo_centralizado=list(CentralizedModule.objects.all().values())
        modulo_centralizado={
            "amount": 1,
            "name": modulo_centralizado[0]["name"],
            "price": modulo_centralizado[0]["price"],
        }
        return modulo_centralizado
  # UNIDAD DE POTENCIA =====================================================================================

def Unidad_potencia(bateria,voltage_sistema):
        unidad_potencia=list(UnityPower.objects.all().values())
        unidad_potencia=sorted(unidad_potencia, key=lambda unidad: unidad["max_ampers_supported"],reverse=False)
        unidad_potencia_adeacuada=0
        print("unidad de potencia =====================",bateria)
        capacidad=(bateria["capacity"]/voltage_sistema)
        for u in unidad_potencia:
            print(u["max_ampers_supported"],u["min_ampers_supported"],bateria["capacity"],capacidad)
            if u["max_ampers_supported"]>=capacidad and u["min_ampers_supported"]<=capacidad:
                unidad_potencia_adeacuada=u
                break
        if unidad_potencia_adeacuada==0:
            unidad_potencia_adeacuada={
                "amount": 0,
                "name": "no hay unidad de potencia adecuada",
                "price": 0,
            }
        else:
            unidad_potencia_adeacuada={
                "amount": 1,
                "name": unidad_potencia_adeacuada["name"],
                "price": unidad_potencia_adeacuada["price"],
            }
        return unidad_potencia_adeacuada
        
  # TERMINAL =====================================================================================

def Terminal():
        terminal=list(Terminals.objects.all().values())
        terminal={
            "amount": 1,
            "name": terminal[0]["name"],
            "price": terminal[0]["price"],
        }
        return terminal
  #CONECTOR =====================================================================================
def Conector(contador_paneles):
        list_pares=[]
        for i in range(0,20,2):
            list_pares.append(i)
        conector=list(Connectors.objects.all().values())
        for c in list_pares:
            if c==contador_paneles:
                conector_apropiado={
                    "amount": c/2,
                    "name": conector[0]["name"],
                    "price": conector[0]["price"],
                }
                break
            if c==1:
                conector_apropiado={
                    "amount": 0,
                    "name": "no hay conector apropiado",
                    "price": 0,
                }
                break
            else:
                conector_apropiado={
                    "amount": (contador_paneles-1)/2,
                    "name": "no hay conector apropiado",
                    "price": 0,
                }
        return conector_apropiado

  #CABLE VEHICULAR =====================================================================================

def Cable_vehicular(amp_requerido):
        vehicleCables=list(VehicleCables.objects.all().values())
        vehicleCables=sorted(vehicleCables, key=lambda cable: cable["supported_amperage"],reverse=False)
        cable_vehicular_apropiado=0
        
        for ch in vehicleCables:
            if ch["supported_amperage"]>=amp_requerido:
                cable_vehicular_apropiado=ch
                break
        if cable_vehicular_apropiado==0:
            cable_vehicular_apropiado=vehicleCables[-1]
        cable_vehicular_apropiado={
            "amount": 2,
            "name": cable_vehicular_apropiado["name"],
            "price": cable_vehicular_apropiado["price"],
        }
        return cable_vehicular_apropiado

  #ELECTRIC MATERIAL =====================================================================================

def Electric_material():
        electric_material=list(ElectricMaterials.objects.all().values())
        electric_material={
            "amount": 1,
            "name": electric_material[0]["name"],
            "price": electric_material[0]["price"],
        }
        return electric_material
  
  #CABLE A TIERRA =====================================================================================

def Cable_tierra():
        groundCable=list(GroundSecurityKits.objects.all().values())
        groundCable={
            "amount": 1,
            "name": groundCable[0]["name"],
            "price": groundCable[0]["price"],
        }
        return groundCable

def rack_baterias(cantidad_baterias):
    list_pares=[]
    for i in range(0,20,2):
        list_pares.append(i)
    rack=list(BatterySupports.objects.all().values())
    for c in list_pares:
        if c==cantidad_baterias:
            rack_apropiado={
                "amount": c/2,
                "name": rack[0]["name"],
                "price": rack[0]["price"],
            }
            break
        if c==1:
            rack_apropiado={
                "amount": 0,
                "name": "no hay rack apropiado",
                "price": 0,
            }
            break
        else:
            rack_apropiado={
                "amount": (cantidad_baterias-1)/2,
                "name": "no hay conector apropiado",
                "price": 0,
            }
    print("rack baterias",rack_apropiado)
    return rack_apropiado