/** Inicializador do serviço de fila  */
import 'dotenv/config';

import Queue from './lib/Queue';

Queue.processQueue();
