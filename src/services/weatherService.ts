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
  petName: string
  speciesLabel: string
  summary: string
  careTips: string[]
  treatIdeas: TreatIdea[]
  hydrationAdvice: string
}

export interface ThermalCareOptions {
  species: PetSpecies
  temperature: number
  coatType?: PetCoatType | null
  cityName?: string
  petName?: string
  breed?: string | null
  speciesCustom?: string | null
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

    const res = await fetch(url)
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

/**
 * Generates 100% species-specific thermal care and treat ideas strictly tailored to that animal.
 * Supports both object options and legacy positional parameters.
 */
export function getThermalCareAndTreats(
  speciesOrOptions: PetSpecies | ThermalCareOptions,
  legacyTemperature?: number,
  legacyCoatType?: PetCoatType | null,
  legacyCityName: string = 'Sua Região',
  legacyPetName?: string,
  legacyBreed?: string | null
): ThermalCareRecommendation {
  let species: PetSpecies
  let temperature: number
  let coatType: PetCoatType | null | undefined
  let cityName: string
  let petName: string
  let breed: string | null | undefined
  let speciesCustom: string | null | undefined

  if (typeof speciesOrOptions === 'object') {
    species = speciesOrOptions.species
    temperature = speciesOrOptions.temperature
    coatType = speciesOrOptions.coatType
    cityName = speciesOrOptions.cityName || 'Sua Região'
    petName = speciesOrOptions.petName || 'Seu Pet'
    breed = speciesOrOptions.breed
    speciesCustom = speciesOrOptions.speciesCustom
  } else {
    species = speciesOrOptions
    temperature = legacyTemperature ?? 24
    coatType = legacyCoatType
    cityName = legacyCityName
    petName = legacyPetName || 'Seu Pet'
    breed = legacyBreed
  }

  const isHot = temperature >= 25
  const isCold = temperature < 18
  const status: 'calor' | 'ameno' | 'frio' = isHot ? 'calor' : isCold ? 'frio' : 'ameno'

  // ==========================================
  // 1. CANINE (Cão / Cachorro)
  // ==========================================
  if (species === 'dog') {
    const speciesLabel = 'Cão'
    if (isHot) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        petName,
        speciesLabel,
        summary: `Alerta de calor (${temperature}°C) para o cão ${petName}. Cães termorregulam quase que exclusivamente pelo arquejo e pelos coxins das patas.`,
        careTips: [
          `Proteção das patas de ${petName}: Teste dos 7 segundos no asfalto com as costas da mão antes de sair. Asfalto quente causa queimaduras dolorosas de 2º grau nas patinhas caninas.`,
          `Horários de passeio: Caminhadas com ${petName} devem ocorrer estritamente antes das 08h30 ou após as 18h30. Não force ${petName} a correr no calor.`,
          coatType === 'double_coat'
            ? `Pelagem dupla de ${petName}: A subpelagem funciona como isolante térmico natural. NUNCA tose ${petName} na máquina zero, pois isso remove a barreira biológica contra o calor solar.`
            : `Sombra e ventilação: Mantenha ${petName} em ambiente ventilado e evite deixá-lo em quintais sem abrigo térmico.`,
          `Sinais de choque térmico canino: Salivação espessa, gengiva muito avermelhada e arquejo acelerado. Molhe virilhas e patas de ${petName} com água fresca e procure um veterinário com urgência.`,
        ],
        hydrationAdvice: `Mantenha tigelas de cerâmica ou inox com água fresca e limpa na sombra para ${petName}. Adicione pedras de gelo limpas para estimular a hidratação canina.`,
        treatIdeas: [
          {
            title: 'Picolé Canino de Melancia & Água de Coco',
            recipeOrDescription: `Bata fatias de melancia fresca (100% sem sementes) com água de coco pura. Congele em forminhas e sirva a ${petName}.`,
            safetyNote: 'Sementes de melancia causam obstrução intestinal grave em cães. Use apenas a polpa.',
            temperatureBadge: 'Refrescante Canino',
          },
          {
            title: `Cenoura Gelada para Mastigação de ${petName}`,
            recipeOrDescription: 'Higienize uma cenoura inteira e deixe no congelador por 3 horas. Sirva como mordedor refrescante e antiestresse.',
            safetyNote: 'Limpa o tártaro mecânico de forma natural sem calorias vazias.',
            temperatureBadge: 'Saúde Dental no Calor',
          },
          {
            title: 'Cubinhos de Caldo de Frango Canino',
            recipeOrDescription: 'Cozinhe peito de frango apenas em água pura (sem sal, cebola ou alho). Congele o caldinho coado em cubos de gelo.',
            safetyNote: 'Cebola e alho são proibidos para cães (causam anemia hemolítica).',
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
        petName,
        speciesLabel,
        summary: `Temperatura baixa (${temperature}°C) para o cão ${petName}. Cães sentem rigidez articular no frio e necessitam de caminha isolada.`,
        careTips: [
          `Articulações de ${petName}: No frio, cães sentem mais dores articulares e musculares. Forre a caminha de ${petName} com mantas grossas isoladas do piso frio.`,
          `Banhos no frio: Evite banhos em dias gelados. Se banhar ${petName}, seque 100% com secador morno (inclusive subpelos) para prevenir fungos e pneumonia.`,
          `Passeios no sol: Aproveite os períodos de sol ameno do meio do dia (11h às 15h) para caminhar com ${petName}.`,
        ],
        hydrationAdvice: `No frio os cães bebem menos água voluntariamente. Adicione caldinho morno por cima da ração de ${petName} para estimular a hidratação.`,
        treatIdeas: [
          {
            title: 'Caldo de Ossos Morno (Bone Broth Canino)',
            recipeOrDescription: 'Cozinhe ossos e carcaça de frango em água pura por 2 horas. Sirva apenas o caldinho morno coado por cima da ração.',
            safetyNote: 'Sirva apenas o caldo coado. NUNCA ofereça ossos cozidos (lascam e perfuram o esôfago).',
            temperatureBadge: 'Nutritivo & Aconchegante',
          },
          {
            title: `Purê Morno de Abóbora para ${petName}`,
            recipeOrDescription: 'Cozinhe abóbora cabotiá no vapor sem sal e amasse até formar um purê macio servido levemente morno.',
            safetyNote: 'Rico em fibras solúveis que protegem a mucosa intestinal no frio.',
            temperatureBadge: 'Energia Suave Canina',
          },
        ],
      }
    }

    // Ameno
    return {
      status,
      temperatureCelsius: temperature,
      city: cityName,
      petName,
      speciesLabel,
      summary: `Clima agradável (${temperature}°C) ideal para o cão ${petName}. Condição excelente para rotinas ativas e enriquecimento ambiental.`,
      careTips: [
        `Passeios e treinos: Momento excelente para caminhadas longas e atividades de farejamento em parques com ${petName}.`,
        `Escovação preventiva: Escove a pelagem de ${petName} para retirar fios mortos e arejar a pele.`,
        `Controle de parasitas: Mantenha a proteção contra pulgas e carrapatos em dia após passeios em áreas gramadas.`,
      ],
      hydrationAdvice: `Leve garrafinha de água portátil e bebedouro retrátil durante passeios de mais de 30 minutos com ${petName}.`,
      treatIdeas: [
        {
          title: 'Palitos Crocantes de Cenoura & Maçã',
          recipeOrDescription: 'Fatias finas de maçã fresca sem sementes e palitos de cenoura crua servidos em temperatura ambiente.',
          safetyNote: 'Remova 100% das sementes de maçã (contêm traços de cianeto).',
          temperatureBadge: 'Crocante & Saudável',
        },
        {
          title: 'Iscas de Peito de Frango no Vapor',
          recipeOrDescription: 'Peito de frango cozido em água pura, desfiado e usado como reforço positivo para treinos com o cão.',
          safetyNote: 'Sem adição de sal, óleo ou condimentos.',
          temperatureBadge: 'Alto Valor Biológico',
        },
      ],
    }
  }

  // ==========================================
  // 2. FELINE (Gato)
  // ==========================================
  if (species === 'cat') {
    const speciesLabel = 'Gato'
    if (isHot) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        petName,
        speciesLabel,
        summary: `Clima quente (${temperature}°C) para o felino ${petName}. Gatos têm sede espontânea muito baixa e risco de sobrecarga renal no calor.`,
        careTips: [
          `Fontes adicionais para ${petName}: Espalhe fontes elétricas de água corrente e tigelas de cerâmica/vidro em 3 cômodos diferentes da casa.`,
          `Termorregulação felina: Gatos deitados no piso frio do banheiro estão trocando calor pela barriga. Não impeça ${petName} de encontrar esses refúgios.`,
          `Não force banhos: Gatos se resfriam pela evaporação da saliva ao lamber o pelo. Passar uma toalha levemente umedecida no dorso de ${petName} alivia sem causar estresse.`,
          `Prevenção renal: Ofereça sachês diluídos com água fresca 2x ao dia para proteger o trato urinário de ${petName}.`,
        ],
        hydrationAdvice: `Gatos rejeitam água parada ou próxima à caixa de areia. Mantenha tigelas largas (que não encostem os bigodes) em locais calmos.`,
        treatIdeas: [
          {
            title: 'Picolé de Sachê Felino',
            recipeOrDescription: `Misture o caldinho do sachê favorito de ${petName} com um pouco de água mineral e congele em cubos de gelo. Sirva em pratinho plano.`,
            safetyNote: 'Estimula a hidratação e sacia a curiosidade predatória felina.',
            temperatureBadge: 'Hidratação Divertida',
          },
          {
            title: 'Sopa Cremosa Geladinha de Sachê',
            recipeOrDescription: 'Sachê batido com 3 colheres de água mineral fresca deixado na geladeira por 15 minutos.',
            safetyNote: 'Nunca use alho, cebola ou alho-poró (são fatais para gatos).',
            temperatureBadge: 'Prevenção Renal Felina',
          },
        ],
      }
    }

    if (isCold) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        petName,
        speciesLabel,
        summary: `Clima frio (${temperature}°C) para o gato ${petName}. Felinos buscam fontes de calor e reduzem ainda mais o consumo de água.`,
        careTips: [
          `Tocas quentinhas para ${petName}: Disponibilize caminhas iglu, tocas forradas com mantas macias ou redes suspensas em pontos altos e sem corrente de ar.`,
          `Aqueça o alimento úmido: Sachês muito gelados no frio diminuem o apetite do gato. Aqueça em banho-maria morno antes de servir a ${petName}.`,
          `Brincadeiras pré-refeição: Brinque com varinhas ou bolinhas por 10 minutos para aquecer o corpo de ${petName} antes da comida.`,
        ],
        hydrationAdvice: `No frio, a água fica gelada e o gato bebe menos. Troque por água fresca em temperatura ambiente 2x ao dia.`,
        treatIdeas: [
          {
            title: `Sachê Morno Aromatizado para ${petName}`,
            recipeOrDescription: 'Aqueça o sachê em banho-maria leve por 2 minutos até atingir a temperatura corporal da presa natural (~37°C).',
            safetyNote: 'Teste nas costas da mão para não queimar a língua do felino.',
            temperatureBadge: 'Estímulo Olfativo Felino',
          },
          {
            title: 'Graminha Fresca de Trigo (Cat Grass)',
            recipeOrDescription: 'Broto fresco de trigo ou aveia própria para gatos. Auxilia na eliminação natural de bolas de pelo acumuladas no inverno.',
            safetyNote: 'Livre de pesticidas e adubos químicos.',
            temperatureBadge: 'Digestivo Natural',
          },
        ],
      }
    }

    // Ameno
    return {
      status,
      temperatureCelsius: temperature,
      city: cityName,
      petName,
      speciesLabel,
      summary: `Condição térmica amena (${temperature}°C) ideal para o gato ${petName}. Excelente para exploração vertical e bem-estar.`,
      careTips: [
        `Enriquecimento vertical: Garanta prateleiras, nichos e arranhadores para ${petName} exercitar o comportamento natural de observação.`,
        `Janelas teladas: Redes de proteção firmes em 100% das janelas são indispensáveis para a segurança de ${petName}.`,
        `Caixa de areia limpa: Remova dejetos 2x ao dia para evitar que ${petName} retenha urina por desconforto.`,
      ],
      hydrationAdvice: `Fontes elétricas de água com filtro de carvão ativado mantêm a água sempre oxigenada e atraente para ${petName}.`,
      treatIdeas: [
        {
          title: 'Iscas Desidratadas de Frango Puro',
          recipeOrDescription: 'Pedaços de filé de frango liofilizado ou cozido no vapor sem tempero como mimo de carinho para o gato.',
          safetyNote: 'Carnívoro estrito: petiscos devem ser ricos em proteína animal.',
          temperatureBadge: 'Proteína Pura',
        },
        {
          title: 'Caldinho Caseiro de Peixe sem Sal',
          recipeOrDescription: 'Água de cozimento de filé de pescada (sem espinhas e sem sal) servida fresca.',
          safetyNote: 'Nenhum tempero adicionado.',
          temperatureBadge: 'Aroma Irresistível',
        },
      ],
    }
  }

  // ==========================================
  // 3. BIRDS (Pássaros e Aves)
  // ==========================================
  if (species === 'bird') {
    const speciesLabel = 'Pássaro / Ave'
    if (isHot) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        petName,
        speciesLabel,
        summary: `Clima quente (${temperature}°C) para a ave ${petName}. Aves regulam calor abrindo levemente as asas e respirando pelo bico.`,
        careTips: [
          `Banheirinha fresca: Deixe uma banheira rasa de plástico com água limpa para ${petName} se banhar e refrescar as penas.`,
          `Nebulização suave: Borrife uma névoa delicada de água mineral acima da gaiola para cair como chuva fina (nunca jatos fortes no bico de ${petName}).`,
          `NUNCA use ventilador direto: Rajadas diretas de ventilador ou ar-condicionado causam pneumonia fulminante em aves. Mantenha ${petName} em ambiente fresco sem vento direto.`,
        ],
        hydrationAdvice: `Troque a água do bebedouro de ${petName} 2 a 3 vezes ao dia no calor para impedir fermentação bacteriana.`,
        treatIdeas: [
          {
            title: `Folha de Couve Fresca Borrifada para ${petName}`,
            recipeOrDescription: 'Folha verde-escura bem higienizada, borrifada com água geladinha e presa com pregador limpo na grade.',
            safetyNote: 'Retire a folha no final da tarde para não fermentar na gaiola.',
            temperatureBadge: 'Cálcio & Hidratação Ave',
          },
          {
            title: 'Rodela de Milho Verde Cozido',
            recipeOrDescription: 'Milho fresco cozido apenas em água pura sem sal servido em temperatura fresca.',
            safetyNote: 'Não use milho enlatado em conserva (excesso de sódio).',
            temperatureBadge: 'Enriquecimento Alimentar',
          },
        ],
      }
    }

    if (isCold) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        petName,
        speciesLabel,
        summary: `Alerta de baixa temperatura (${temperature}°C) para a ave ${petName}. Correntes de ar frio são a causa principal de problemas respiratórios graves.`,
        careTips: [
          `Proteção contra correntes de ar: Cubra 3 lados da gaiola de ${petName} com um tecido respirável à noite para reter calor.`,
          `Sinais de frio em aves: Se ${petName} ficar muito quieto, no fundo da gaiola ou com as penas eriçadas como uma bola, ele está com frio intenso.`,
          `Afaste de janelas frias: Mantenha a gaiola em cômodo interno longe de portas com frestas de vento.`,
        ],
        hydrationAdvice: `Forneça água em temperatura ambiente todos os dias pela manhã. Nunca use água gelada no inverno para aves.`,
        treatIdeas: [
          {
            title: `Sementes de Abóbora Tostadas para ${petName}`,
            recipeOrDescription: 'Sementes de abóbora cruas tostadas levemente na frigideira sem óleo e sem sal.',
            safetyNote: 'Fornece lipídios e calorias nobres para termorregulação no frio.',
            temperatureBadge: 'Calorias Saudáveis',
          },
          {
            title: 'Papa Morna de Frutas Permitidas',
            recipeOrDescription: 'Purê de maçã ou mamão sem sementes levemente amornado servido em pote limpo.',
            safetyNote: 'Sementes de maçã e abacate são tóxicos e proibidos para aves.',
            temperatureBadge: 'Aconchego Nutritivo',
          },
        ],
      }
    }

    // Ameno
    return {
      status,
      temperatureCelsius: temperature,
      city: cityName,
      petName,
      speciesLabel,
      summary: `Clima ameno (${temperature}°C) ideal para a ave ${petName}. Excelente para banhos de sol e exercícios com asas.`,
      careTips: [
        `Sol matinal: 15 minutos de sol antes das 08h30 estimulam a síntese de vitamina D3 nas penas de ${petName} (metade da gaiola sempre na sombra).`,
        `Voos livres supervisionados: Feche janelas, cortinas e desligue ventiladores de teto antes de soltar ${petName}.`,
        `Poleiros naturais: Forneça galhos de diâmetros variados para evitar calos nas patinhas de ${petName}.`,
      ],
      hydrationAdvice: `Higienize o bebedouro diariamente com escovinha exclusiva para aves.`,
      treatIdeas: [
        {
          title: 'Ramos de Brócolis e Rúcula',
          recipeOrDescription: 'Folhas e flores de brócolis cru higienizado oferecidos suspensos na gaiola.',
          safetyNote: 'Lave em água corrente abundante.',
          temperatureBadge: 'Vitalidade & Vitaminas',
        },
        {
          title: 'Mix Nobre Extrusado para Psitacídeos',
          recipeOrDescription: 'Grãos extrusados balanceados com pedacinhos de sementes nobres.',
          safetyNote: 'Dieta base de alta densidade nutricional.',
          temperatureBadge: 'Nutrição Completa',
        },
      ],
    }
  }

  // ==========================================
  // 4. RABBIT (Coelhos)
  // ==========================================
  if (species === 'rabbit') {
    const speciesLabel = 'Coelho'
    if (isHot) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        petName,
        speciesLabel,
        summary: `ALERTA GRAVE DE CALOR (${temperature}°C) para o coelho ${petName}. Coelhos NÃO suam e NÃO arquejam: temperaturas acima de 26°C trazem risco extremo de choque térmico fatal.`,
        careTips: [
          `Garrafas congeladas no cercado: Congele garrafas pet com água, envolva em toalhas limpas de algodão e deixe no cercado para ${petName} encostar e se resfriar.`,
          `Piso frio de cerâmica: Coloque pisos ou lajotas de cerâmica limpos no chão para ${petName} deitar a barriguinha e trocar calor.`,
          `Orelhas de ${petName}: As orelhas são os radiadores de calor do coelho. Umedeça delicadamente a parte de trás das orelhas com os dedos molhados em água fresca se notar calor excessivo.`,
          `Feno ilimitado 24h: O estresse térmico pode causar estase cecal. O feno Timothy ou Tifton precisa estar acessível 100% do tempo.`,
        ],
        hydrationAdvice: `Disponibilize tigelas pesadas de cerâmica com água fresca constante para ${petName} (coelhos bebem mais água em tigela aberta do que em bico de bilha).`,
        treatIdeas: [
          {
            title: `Fatias de Pepino & Hortelã para ${petName}`,
            recipeOrDescription: 'Fatias finas de pepino sem casca e folhinhas de hortelã fresca lavadas.',
            safetyNote: 'Excelente teor hídrico e refrescância sem excesso de açúcares.',
            temperatureBadge: 'Refrescante & Digestivo',
          },
          {
            title: 'Feno Timothy Aromatizado com Ervas',
            recipeOrDescription: 'Feno verdinho misturado com algumas folhinhas de manjericão fresco para estimular o apetite.',
            safetyNote: '80% da alimentação do coelho deve ser feno seco.',
            temperatureBadge: 'Vital para a Espécie',
          },
        ],
      }
    }

    if (isCold) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        petName,
        speciesLabel,
        summary: `Temperatura fria (${temperature}°C) para o coelho ${petName}. Proteja contra umidade e correntes de ar diretas.`,
        careTips: [
          `Ninho de feno extra: Aumente a quantidade de feno limpo e seco no cercado para ${petName} construir seu refúgio térmico.`,
          `Cuidado com chão úmido: Coelhos suportam o frio se o ambiente estiver 100% seco e protegido de ventanias.`,
        ],
        hydrationAdvice: `Verifique se a água da tigela não está congelante. Troque 2x ao dia por água em temperatura ambiente.`,
        treatIdeas: [
          {
            title: 'Raminhos de Chicória e Rúcula Frescas',
            recipeOrDescription: 'Folhas verde-escuras bem lavadas servidas frescas.',
            safetyNote: 'Nunca ofereça alface americana (pode causar diarreia severa).',
            temperatureBadge: 'Fibras & Minerais',
          },
          {
            title: `Feno Tifton Fibroso para ${petName}`,
            recipeOrDescription: 'A mastigação contínua de feno gera fermentação cecal que produz calor interno natural para o corpo do coelho.',
            safetyNote: 'A base inegociável da saúde digestiva e dental do coelho.',
            temperatureBadge: 'Termorregulação Natural',
          },
        ],
      }
    }

    // Ameno
    return {
      status,
      temperatureCelsius: temperature,
      city: cityName,
      petName,
      speciesLabel,
      summary: `Clima ameno (${temperature}°C) ideal para o coelho ${petName}. Conforto térmico excelente.`,
      careTips: [
        `Escovação na troca de pelos: Coelhos não têm reflexo de vômito. Escove ${petName} para retirar pelos soltos e prevenir bolas de pelo no estômago.`,
        `Ambiente seguro (Rabbit-Proof): Fios elétricos, rodapés e plantas ornamentais devem estar fora do alcance dos dentes de ${petName}.`,
      ],
      hydrationAdvice: `Tigela pesada de cerâmica com água filtrada fresca renovada diariamente.`,
      treatIdeas: [
        {
          title: 'Folhas de Salsa e Coentro Frescos',
          recipeOrDescription: 'Raminhos aromáticos oferecidos na mão como mimo e aproximação com o tutor.',
          safetyNote: 'Ofereça em moderação como reforço positivo.',
          temperatureBadge: 'Estímulo Olfativo',
        },
        {
          title: 'Pedaço Pequeno de Maçã sem Sementes',
          recipeOrDescription: 'Um cubo pequeno de maçã sem miolo oferecido 1x por semana como petisco especial.',
          safetyNote: 'Frutas são ricas em açúcar; oferecer apenas como mimo raro.',
          temperatureBadge: 'Mimo Especial',
        },
      ],
    }
  }

  // ==========================================
  // 5. HAMSTER (Hamsters)
  // ==========================================
  if (species === 'hamster') {
    const speciesLabel = 'Hamster'
    if (isHot) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        petName,
        speciesLabel,
        summary: `Alerta de calor (${temperature}°C) para o hamster ${petName}. Hamsters são pequenos e superaquecem rapidamente acima de 24°C.`,
        careTips: [
          `Caneca ou prato de cerâmica gelado: Deixe uma caneca de cerâmica limpa na geladeira por 30 minutos e coloque no alojamento para ${petName} entrar e se refrescar.`,
          `Afaste do sol: Nunca deixe a gaiola perto de janelas ou onde bata sol direto.`,
          `Ventilação: Evite caixas plásticas abafadas em dias quentes; utilize alojamentos amplos e bem ventilados.`,
        ],
        hydrationAdvice: `Verifique o bebedouro de bilha de ${petName} todos os dias para garantir que a bolinha de metal não travou.`,
        treatIdeas: [
          {
            title: `Pedacinho Geladinho de Maçã para ${petName}`,
            recipeOrDescription: 'Um pedacinho minúsculo de maçã fresca sem casca e sem semente deixado na geladeira por 15 minutos.',
            safetyNote: 'Porções minúsculas (do tamanho de uma unha) para não fermentar na bolsa da bochecha.',
            temperatureBadge: 'Refresco Pequeno Porte',
          },
          {
            title: 'Fatia Fina de Abobrinha Crua',
            recipeOrDescription: 'Abobrinha fresca bem lavada cortada em fatia fina.',
            safetyNote: 'Rica em água e sem excesso de açúcar.',
            temperatureBadge: 'Hidratação Roedor',
          },
        ],
      }
    }

    return {
      status,
      temperatureCelsius: temperature,
      city: cityName,
      petName,
      speciesLabel,
      summary: `Condição térmica monitorada (${temperature}°C) para o hamster ${petName}.`,
      careTips: [
        `Substrato abundante: Coloque bastante papel higiênico picado sem perfume ou substrato de celulose para ${petName} forrar seu ninho.`,
        `Atividade noturna: Hamsters são noturnos; mantenha a rodinha de exercícios silenciosa e com superfície fechada (sem grades que prendem a pata).`,
      ],
      hydrationAdvice: `Água fresca limpa no bebedouro de bico todos os dias.`,
      treatIdeas: [
        {
          title: 'Semente de Abóbora Crua sem Sal',
          recipeOrDescription: 'Uma semente de abóbora seca natural sem sal como mimo saudável.',
          safetyNote: 'Excelente para o desgaste saudável dos dentes incisivos.',
          temperatureBadge: 'Desgaste Dental',
        },
        {
          title: 'Tiras de Cenoura Crua',
          recipeOrDescription: 'Um pedacinho pequeno de cenoura fresca bem limpa.',
          safetyNote: 'Ofereça 2 vezes por semana.',
          temperatureBadge: 'Vitaminas Roedor',
        },
      ],
    }
  }

  // ==========================================
  // 6. GUINEA PIG (Porquinho-da-Índia)
  // ==========================================
  if (species === 'guinea_pig') {
    const speciesLabel = 'Porquinho-da-Índia'
    if (isHot) {
      return {
        status,
        temperatureCelsius: temperature,
        city: cityName,
        petName,
        speciesLabel,
        summary: `Alerta de calor (${temperature}°C) para o porquinho-da-índia ${petName}. Essa espécie não transpira e sofre com calor acima de 25°C.`,
        careTips: [
          `Garrafa pet com gelo enrolada em pano: Coloque no cantinho do cercado de ${petName} para alívio térmico imediato.`,
          `Feno abundante e fresco: 80% da dieta do porquinho-da-índia é feno limpo e seco.`,
          `Aporte diário de Vitamina C: Porquinhos-da-índia NÃO produzem Vitamina C no organismo e necessitam dela diariamente.`,
        ],
        hydrationAdvice: `Mantenha 2 bebedouros de bilha com água fresca renovada.`,
        treatIdeas: [
          {
            title: `Pimentão Amarelo e Vermelho para ${petName}`,
            recipeOrDescription: 'Fatias frescas de pimentão sem sementes (a melhor fonte natural de Vitamina C para porquinhos-da-índia).',
            safetyNote: 'Essencial diariamente para prevenir escorbuto na espécie.',
            temperatureBadge: 'Vitamina C Vital',
          },
          {
            title: 'Fatias de Pepino Hidratante',
            recipeOrDescription: 'Pepino cru higienizado oferecido fresco no cercado.',
            safetyNote: 'Hidratação rápida em dias quentes.',
            temperatureBadge: 'Hidratação Natural',
          },
        ],
      }
    }

    return {
      status,
      temperatureCelsius: temperature,
      city: cityName,
      petName,
      speciesLabel,
      summary: `Clima de ${temperature}°C monitorado para o porquinho-da-índia ${petName}.`,
      careTips: [
        `Proteja do piso frio e vento: Forre o chão do cercado com soft/fleece limpo e absorvente.`,
        `Feno 24h: Mantenha porta-feno sempre cheio para o desgaste dos dentes e motilidade cecal.`,
      ],
      hydrationAdvice: `Água fresca em bebedouro limpo diariamente.`,
      treatIdeas: [
        {
          title: 'Folhas de Chicória e Couve',
          recipeOrDescription: 'Folhas verdes bem higienizadas servidas frescas.',
          safetyNote: 'Lave em água corrente.',
          temperatureBadge: 'Fibras & Vitaminas',
        },
        {
          title: 'Feno Tifton Especial',
          recipeOrDescription: 'Feno verdinho aromático para o porquinho mastigar o dia todo.',
          safetyNote: 'A base inegociável da saúde do porquinho-da-índia.',
          temperatureBadge: 'Nutrição Diária',
        },
      ],
    }
  }

  // ==========================================
  // 7. FERRET (Furão)
  // ==========================================
  if (species === 'ferret') {
    const speciesLabel = 'Furão / Ferret'
    return {
      status,
      temperatureCelsius: temperature,
      city: cityName,
      petName,
      speciesLabel,
      summary: `Orientação térmica (${temperature}°C) para o furão ${petName}. Furões são extremamente intolerantes a temperaturas acima de 26°C.`,
      careTips: [
        isHot
          ? `Risco de choque térmico: Furões entram em colapso rápido no calor. Mantenha ${petName} em ambiente refrigerado (idealmente entre 18°C e 23°C).`
          : `Redes quentinhas: Forre redes suspensas com tecidos de microfibra para ${petName} dormir aquecido.`,
        `Carnívoro estrito: Furões não digerem fibras vegetais, frutas ou açúcares. A dieta deve ser 100% à base de carne e ração de alta proteína animal.`,
      ],
      hydrationAdvice: `Furões adoram brincar com tigelas de água; utilize bebedouros pesados ou garrafas com bico largo de alta vazão.`,
      treatIdeas: [
        {
          title: `Caldinho Geladinho de Frango Puro para ${petName}`,
          recipeOrDescription: 'Cozinhe peito de frango apenas em água pura (sem sal ou cebola) e sirva o caldinho fresco.',
          safetyNote: 'NUNCA ofereça frutas, pães ou açúcar para furões (risco de insulinoma).',
          temperatureBadge: 'Proteína Pura Mustelídeo',
        },
        {
          title: 'Iscas de Carne de Frango Cozida',
          recipeOrDescription: 'Pedaços desfiados de frango morno servidos na mão.',
          safetyNote: 'Livre de temperos.',
          temperatureBadge: 'Alta Energia Carnívora',
        },
      ],
    }
  }

  // ==========================================
  // 8. REPTILE (Réptil)
  // ==========================================
  if (species === 'reptile') {
    const speciesLabel = 'Réptil'
    return {
      status,
      temperatureCelsius: temperature,
      city: cityName,
      petName,
      speciesLabel,
      summary: `Controle térmico (${temperature}°C) para o réptil ${petName}. Répteis são ectotérmicos e dependem do gradiente de temperatura do terrário.`,
      careTips: [
        `Gradiente térmico obrigatório: Mantenha o lado quente do terrário (com lâmpada de aquecimento/basking spot) e o lado fresco com abrigo para ${petName} regular a temperatura corporal.`,
        `Lâmpada UVB: Essencial para a absorção de cálcio e síntese de Vitamina D3 nas escamas/carapaça de ${petName}. Troque a lâmpada a cada 6-12 meses.`,
        `Higrometria e umidade: Monitore o higrômetro do terrário; umidade adequada previne problemas graves durante a troca de pele (ecdisse).`,
      ],
      hydrationAdvice: `Mantenha recipiente raso com água limpa para que ${petName} possa entrar e se hidratar por imersão.`,
      treatIdeas: [
        {
          title: `Flores de Hibisco Frescas para ${petName}`,
          recipeOrDescription: 'Pétalas de hibisco natural higienizadas sem agrotóxicos.',
          safetyNote: 'Rico em antioxidantes naturais para répteis herbívoros/onívoros.',
          temperatureBadge: 'Cálcio & Enriquecimento Réptil',
        },
        {
          title: 'Folhas de Dente-de-Leão e Mostarda',
          recipeOrDescription: 'Folhas verde-escuras ricas na relação Cálcio:Fósforo ideal para répteis.',
          safetyNote: 'Higienize bem antes de oferecer.',
          temperatureBadge: 'Saúde Óssea Réptil',
        },
      ],
    }
  }

  // ==========================================
  // 9. OTHER SPECIES (Outras Espécies)
  // ==========================================
  const customName = speciesCustom || 'Animal de Estimação'
  return {
    status,
    temperatureCelsius: temperature,
    city: cityName,
    petName,
    speciesLabel: customName,
    summary: `Orientações de cuidados na temperatura de ${temperature}°C para ${petName} (${customName}).`,
    careTips: [
      `Atenção à faixa de conforto térmico de ${customName}: Evite picos extremos de calor ou frio repentinos.`,
      `Ambiente seguro e silencioso: Mantenha o alojamento de ${petName} limpo, arejado e protegido de predadores domésticos.`,
      `Consulta veterinária especializada: Animais exóticos ou não convencionais devem ter acompanhamento com médico veterinário especialista em animais silvestres.`,
    ],
    hydrationAdvice: `Forneça água fresca e potável constante adequada para a anatomia de ${customName}.`,
    treatIdeas: [
      {
        title: `Mimo Especial para ${petName}`,
        recipeOrDescription: `Alimento natural seguro recomendado pelo médico veterinário responsável por ${petName}.`,
        safetyNote: 'Consulte a lista de alimentos tóxicos antes de introduzir qualquer novo ingrediente.',
        temperatureBadge: 'Cuidado Personalizado',
      },
    ],
  }
}
