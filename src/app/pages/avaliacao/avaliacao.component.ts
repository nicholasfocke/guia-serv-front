import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServicoPublico } from '../../core/models/servico-publico.model';
import { UnidadeAtendimento } from '../../core/models/unidade-atendimento.model';
import { AvaliacaoService } from '../../core/services/avaliacao.service';
import { ServicoService } from '../../core/services/servico.service';
import { ServicoUnidadeService } from '../../core/services/servico-unidade.service';
import { apiErrorMessage } from '../../shared/utils/api-response.util';

@Component({
  selector: 'app-avaliacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.css']
})
export class AvaliacaoComponent implements OnInit {
  servicos: ServicoPublico[] = [];
  unidades: UnidadeAtendimento[] = [];
  servicoId = '';
  unidadeId = '';
  nota = 5;
  comentario = '';
  carregando = false;
  mensagem = '';
  erro = '';

  constructor(
    private route: ActivatedRoute,
    private servicoService: ServicoService,
    private servicoUnidadeService: ServicoUnidadeService,
    private avaliacaoService: AvaliacaoService
  ) {}

  ngOnInit(): void {
    this.servicoId = this.route.snapshot.queryParamMap.get('servicoId') ?? '';
    this.servicoService.listar().subscribe((servicos) => this.servicos = servicos);
    if (this.servicoId) {
      this.carregarUnidades();
    }
  }

  carregarUnidades(): void {
    const id = Number(this.servicoId);
    this.unidadeId = '';
    this.unidades = [];

    if (!id) {
      return;
    }

    this.servicoUnidadeService.listarPorServico(id).subscribe({
      next: (vinculos) => {
        this.unidades = vinculos
          .map((vinculo) => vinculo.unidade)
          .filter((unidade): unidade is UnidadeAtendimento => Boolean(unidade));
        if (this.unidades.length === 1) {
          this.unidadeId = String(this.unidades[0].id);
        }
      },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel carregar as unidades do servico.')
    });
  }

  enviar(): void {
    const id = Number(this.servicoId);
    const unidadeId = Number(this.unidadeId);
    if (!id) {
      this.erro = 'Selecione um servico para avaliar.';
      return;
    }
    if (!unidadeId) {
      this.erro = 'Selecione a unidade onde voce foi atendido.';
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.mensagem = '';
    this.avaliacaoService.criar({ servicoId: id, unidadeId, nota: this.nota, comentario: this.comentario }).subscribe({
      next: () => {
        this.mensagem = 'Avaliacao enviada com sucesso.';
        this.comentario = '';
        this.nota = 5;
        this.carregando = false;
      },
      error: (error) => {
        this.erro = apiErrorMessage(error, 'Nao foi possivel enviar a avaliacao.');
        this.carregando = false;
      }
    });
  }
}
