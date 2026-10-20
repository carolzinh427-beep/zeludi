import type { PetSpecies, PetCoatType } from '@/types/database.types'

export interface WeatherData {
  city: string
  temperature: number
  humidity: number
  apparentTemperature: number
  weatherCode: number
  windSpeed: number
  conditionText: string
  isRain: boolean
  isExtremeHeat: boolean
  isExcessiveCold: boolean
  fetchedAt: string
}

export interface TreatIdea {
  title: string
  recipeOrDescription: string
  safetyNote: string
  temperatureBadge: string
}

export interface ThermalCareRecommendation {
  status: 'calor' | 'ameno' | 'frio'
  temperatureCelsius: number
  city: string
  summary: string
  careTips: string[]
  treatIdeas: TreatIdea[]
  hydrationAdvice: string
}

// Map WMO weather codes to human-readable Portuguese conditions
function interpretWmoCode(code: number): { text: string; isRain: boolean } {
  if (code === 0) return { text: 'Céu limpo e ensolarado', isRain: false }
  if (code === 1 || code === 2) return { text: 'Parcialmente nublado', isRain: false }
  if (code === 3) return { text: 'Encoberto / Nublado', isRain: false }
  if (code >= 45 && code <= 48) return { text: 'Nevoeiro / Neblina', isRain: false }
  if (code >= 51 && code <= 55) return { text: 'Garoa leve', isRain: true }
  if (code >= 61 && code <= 65) return { text: 'Chuva', isRain: true }
  if (code >= 80 && code <= 82) return { text: 'Pancadas de chuva', isRain: true }
  if (code >= 95) return { text: 'Tempestade com trovoadas', isRain: true }
  return { text: 'Condições estáveis', isRain: false }
}

export async function fetchCurrentWeather(
  latitude: number = -23.55052,
  longitude: number = -46.633308,
  cityName: string = 'São Paulo'
): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`

    const res = await fetch(url, { next: { revalidate: 900 } })
    if (!res.ok) {
      throw new Error(`Weather API error: ${res.statusText}`)
    }

    const data = await res.json()
    const current = data.current
    const condition = interpretWmoCode(current.weather_code)

    return {
      city: cityName,
      temperature: Math.round(current.temperature_2m * 10) / 10,
      humidity: Math.round(current.relative_humidity_2m),
      apparentTemperature: Math.round(current.apparent_temperature * 10) / 10,
      weatherCode: current.weather_code,
      windSpeed: Math.round(current.wind_speed_10m),
      conditionText: condition.text,
      isRain: condition.isRain,
      isExtremeHeat: current.temperature_2m >= 28,
      isExcessiveCold: current.temperature_2m <= 15,
      fetchedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.warn('Using standard fallback weather due to network limit:', err)
    return {
      city: cityName,
      temperature: 24,
      humidity: 65,
      apparentTemperature: 24.5,
      weatherCode: 1,
      windSpeed: 12,
      conditionText: 'Tempo ameno (Dados locais)',
      isRain: false,
      isExtremeHeat: false,
      isExcessiveCold: false,
      fetchedAt: new Date().toISOString(),
    }
  }
}

export function getThermalCareAndTreats(
  species: PetSpecies,
  temperature: number,
  coatType?: PetCoatType | null,
  cityName: string = 'Sua Região'
): ThermalCareRecommendation {
  const isHot = temperature >= 25
  const isCold = temperature < 18
  const status: 'calor' | 'ameno' | 'frio' = isHot ? 'calor' : isCold ? 'frio' : 'ameno'

  // CANINE (Cão)
  if (species === 'dog') {
    if (isHot) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        summary: `Temperatura elevada (${temperature}°C). Cuidado especial com hipertermia e proteção dos coxins plantares.`,
        careTips: [
          'Teste dos 7 segundos: coloque as costas da mão no asfalto; se queimar sua mão, vai lesionar as patas do seu cão.',
          'Passeios permitidos somente antes das 08h30 ou após as 18h30.',
          coatType === 'double_coat'
            ? 'Cães de pelagem dupla (ex: Golden, Husky, Pastor) NÃO devem ser raspados na máquina. A subpelagem isola o calor.'
            : 'Evite exercícios intensos ou corridas nos horários de maior incidência solar.',
          'Troque a água do bebedouro com frequência e adicione algumas pedras de gelo limpo.',
        ],
        hydrationAdvice: 'Mantenha bebedouros de inox ou cerâmica na sombra com água fresca renovada.',
        treatIdeas: [
          {
            title: 'Picolé de Melancia com Água de Coco',
            recipeOrDescription:
              'Bata pedaços de melancia fresca (100% sem sementes) com água de coco natural. Congele em forminhas de silicone.',
            safetyNote: 'Nunca deixe sementes de melancia, pois causam obstrução intestinal.',
            temperatureBadge: 'Refrescante & Hidratante',
          },
          {
            title: 'Cenoura Congelada para Mastigação',
            recipeOrDescription:
              'Higienize uma cenoura inteira e deixe no congelador por 3 horas. Sirva como mordedor refrescante e antiestresse.',
            safetyNote: 'Ideal para limpar tártaro de forma natural e sem calorias vazias.',
            temperatureBadge: 'Saúde Dental no Calor',
          },
          {
            title: 'Cubinhos Gelados de Caldo Natural',
            recipeOrDescription:
              'Cozinhe peito de frango apenas em água pura (sem sal, alho ou cebola). Congele o caldinho em cubos de gelo.',
            safetyNote: 'Proibido alho e cebola (altamente tóxicos para cães).',
            temperatureBadge: 'Isotônico Natural',
          },
        ],
      }
    }

    if (isCold) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        summary: `Temperatura fria (${temperature}°C). Proteja articulações e mantenha o animal aquecido e bem alimentado.`,
        careTips: [
          'Cães idosos ou de porte grande sentem rigidez articular no frio. Forre caminhas com mantas grossas.',
          'Evite banhos em dias muito frios ou seque completamente o pelo e subpelo com soprador morno.',
          'Passeios nos períodos ensolarados do meio do dia (11h às 15h) são os mais agradáveis.',
        ],
        hydrationAdvice: 'No frio os cães bebem menos água espontaneamente. Adicione caldo morno na refeição para estimular a hidratação.',
        treatIdeas: [
          {
            title: 'Caldo de Ossos Morno (Bone Broth Canino)',
            recipeOrDescription:
              'Cozinhe ossos e carcaça de frango em água pura por 2 horas. Sirva o caldinho morno por cima da ração.',
            safetyNote: 'Sirva apenas o caldo coado morno. NUNCA ofereça os ossos cozidos.',
            temperatureBadge: 'Nutritivo & Aconchegante',
          },
          {
            title: 'Purê Morno de Abóbora Cabotiá',
            recipeOrDescription:
              'Cozinhe a abóbora no vapor sem sal e amasse até formar um purê macio servido levemente morno.',
            safetyNote: 'Rico em fibras solúveis que protegem a mucosa gástrica no frio.',
            temperatureBadge: 'Energia Suave',
          },
        ],
      }
    }

    return {
      status,
      temperatureCelsius: temperature,
      city: cityName,
      summary: `Temperatura agradável e amena (${temperature}°C). Condição excelente para rotinas ativas e passeios enriquecedores.`,
      careTips: [
        'Excelente momento para caminhadas mais longas e exploração olfativa em parques.',
        'Escovação preventiva para controle de pelos mortos e arejamento cutâneo.',
        'Mantenha a rotina normal de exercícios físicos e treinamentos.',
      ],
      hydrationAdvice: 'Leve garrafinha de água durante passeios de mais de 30 minutos.',
      treatIdeas: [
        {
          title: 'Palitos Crocantes de Cenoura & Maçã',
          recipeOrDescription:
            'Fatias finas de maçã fresca sem sementes e palitos de cenoura crua servidos em temperatura ambiente.',
          safetyNote: 'Remova totalmente o miolo e sementes da maçã.',
          temperatureBadge: 'Crocante & Saudável',
        },
        {
          title: 'Petisco de Frango Desfiado no Vapor',
          recipeOrDescription:
            'Peito de frango cozido em água pura, desfiado e usado como reforço positivo para treino.',
          safetyNote: 'Sem sal ou óleo.',
          temperatureBadge: 'Alto Valor Biológico',
        },
      ],
    }
  }

  // FELINE (Gato)
  if (species === 'cat') {
    if (isHot) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        summary: `Clima quente (${temperature}°C). Gatos tendem a diminuir o consumo hídrico, exigindo hidratação preventiva.`,
        careTips: [
          'Espalhe pelo menos 3 fontes ou potes adicionais de água fresca pela casa.',
          'Gatos deitados no chão frio ou esticados estão termorregulando; não os impeça.',
          'Umedeça a ração seca com água fresca ou caldo natural para prevenir cristais renais.',
        ],
        hydrationAdvice: 'Ofereça alimentos úmidos (sachês completos) duas vezes ao dia para hidratação das vias urinárias.',
        treatIdeas: [
          {
            title: 'Picolé de Caldo de Sachê para Gatos',
            recipeOrDescription:
              'Misture o caldinho do sachê favorito do felino com um pouco de água e congele em forminhas de gelo. Sirva em um pratinho plano.',
            safetyNote: 'Estimula a hidratação e sacia a curiosidade felina.',
            temperatureBadge: 'Hidratação Divertida',
          },
          {
            title: 'Sopa Cremosa de Frango Geladinho',
            recipeOrDescription:
              'Sachê batido com 3 colheres de água mineral fresca deixado na geladeira por 15 minutos.',
            safetyNote: 'Nunca use cebola, alho ou alho-poró.',
            temperatureBadge: 'Prevenção Renal',
          },
        ],
      }
    }

    return {
      status,
      temperatureCelsius: temperature,
      city: cityName,
      summary: `Condição térmica (${temperature}°C) monitorada para felinos.`,
      careTips: [
        'Disponibilize caminhas acolchoadas em pontos altos e ensolarados da casa.',
        'Estimule brincadeiras com varinhas antes das refeições para incentivar o comportamento predatório.',
        'Mantenha a caixa higiênica sempre limpa para evitar retenção urinária.',
      ],
      hydrationAdvice: 'Fontes de água corrente com filtro limpo estimulam 3x mais o consumo hídrico de gatos.',
      treatIdeas: [
        {
          title: 'Sachê Morno Aromatizado',
          recipeOrDescription:
            'Aqueça o sachê em banho-maria leve por 2 minutos (temperatura morna do corpo da presa, ~37°C).',
          safetyNote: 'Nunca superaqueça para não queimar a língua do gato.',
          temperatureBadge: 'Estímulo Olfativo',
        },
        {
          title: 'Graminha de Trigo / Aveia Fresca (Cat Grass)',
          recipeOrDescription:
            'Broto fresco de trigo ou aveia própria para gatos. Auxilia na eliminação natural de bolas de pelo.',
          safetyNote: 'Livre de pesticidas e adubos químicos.',
          temperatureBadge: 'Enriquecimento Natural',
        },
      ],
    }
  }

  // BIRDS (Aves)
  if (species === 'bird') {
    return {
      status,
      temperatureCelsius: temperature,
      city: cityName,
      summary: `Clima atual de ${temperature}°C. Aves possuem sistema respiratório delicado e exigem proteção contra ventanias.`,
      careTips: [
        'NUNCA posicione a gaiola sob fluxo direto de ventilador ou aparelho de ar-condicionado.',
        isHot
          ? 'Em dias quentes, borrife uma névoa suave de água fresca acima da gaiola para que caia como chuva fina.'
          : 'Em dias frios, cubra 3 lados da gaiola à noite com tecido respirável para evitar correntes de ar.',
        'Troque a água do bebedouro diariamente.',
      ],
      hydrationAdvice: 'Mantenha bebedouro limpo e longe de poleiros onde fezes possam cair.',
      treatIdeas: [
        {
          title: 'Folha de Couve Fresca Borrifada',
          recipeOrDescription:
            'Folha verde-escura bem higienizada, presa com pregador limpo na grade da gaiola.',
          safetyNote: 'Remova se sobrar no final do dia para não fermentar.',
          temperatureBadge: 'Cálcio & Vitaminas',
        },
        {
          title: 'Rodela de Milho Verde Cozido',
          recipeOrDescription:
            'Milho fresco cozido em água pura sem sal servido em temperatura ambiente.',
          safetyNote: 'Não use milho em conserva enlatado.',
          temperatureBadge: 'Enriquecimento Alimentar',
        },
      ],
    }
  }

  // RABBITS & RODENTS (Coelhos e Pequenos Mamíferos)
  return {
    status,
    temperatureCelsius: temperature,
    city: cityName,
    summary: `Temperatura de ${temperature}°C. Coelhos e roedores têm limites estreitos de conforto térmico.`,
    careTips: [
      isHot
        ? 'Risco grave de estresse térmico acima de 27°C. Coloque garrafas pet com água congelada enroladas em toalha no cercado.'
        : 'Garanta fartura de feno limpo e seco para que o animal possa construir seu ninho isolante.',
      'Feno de capim Timothy / Tifton obrigatório 24 horas por dia (80% da alimentação).',
      'Piso de cerâmica fria no chão permite que o pet deite a barriga e troque calor confortavelmente.',
    ],
    hydrationAdvice: 'Bebedouros tipo bico de bilha ou tigelas pesadas de cerâmica com água fresca constante.',
    treatIdeas: [
      {
        title: 'Fatias de Pepino e Hortelã Fresca',
        recipeOrDescription:
          'Folhinhas de hortelã fresca higienizada e uma fatia fina de pepino sem sementes.',
        safetyNote: 'Em moderação para não soltar o intestino cecal.',
        temperatureBadge: 'Refrescante & Digestivo',
      },
      {
        title: 'Feno Timothy Verdejante Aromatizado',
        recipeOrDescription:
          'Feno de capim fresco e crocante oferecido suspenso em porta-feno limpo.',
        safetyNote: 'A base inegociável da saúde digestiva e dental.',
        temperatureBadge: 'Vital para a Espécie',
      },
    ],
  }
}
