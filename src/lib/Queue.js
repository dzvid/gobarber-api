import Bee from 'bee-queue';
import redis from 'redis';

import CancellationMail from '../app/jobs/CancellationMail';

// Configuração do Redis
import redisConfig from '../config/redis';

// Serviços de background da aplicação
const jobs = [CancellationMail];

/** A classe contém todas as configurações relacionadas à inicialização e
 * gerenciamento de filas/jobs realizadas pelo Bee queue / Redis
 */
class Queue {
  constructor() {
    this.queues = {};

    this.redisClient = redis.createClient(redisConfig);

    this.init();
  }

  /**
   * Inicializa os serviços de background (jobs)
   */
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: this.redisClient,
        }),
        handle,
      };
    });
  }

  /**
   * Método para adicionar uma nova tarefa em uma fila
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * Realiza o processamento das filas
   * (faz a chamado ao metodo handle das tarefas nas filas)
   */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  /**
   * Método para auxiliar no monitoramento de erro (gera um 'log' na falha)
   */
  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
