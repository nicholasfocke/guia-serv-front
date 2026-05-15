import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Avaliacao } from '../../core/models/avaliacao.model';
import { HorarioFuncionamento } from '../../core/models/horario-funcionamento.model';
import { ServicoUnidade } from '../../core/models/servico-unidade.model';
import { UnidadeAtendimento } from '../../core/models/unidade-atendimento.model';
import { AvaliacaoService } from '../../core/services/avaliacao.service';
import { HorarioService } from '../../core/services/horario.service';
import { ServicoUnidadeService } from '../../core/services/servico-unidade.service';
import { UnidadeService } from '../../core/services/unidade.service';
import { apiErrorMessage } from '../../shared/utils/api-response.util';

@Component({
  selector: 'app-unidade-detalhes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './unidade-detalhes.component.html',
  styleUrls: ['./unidade-detalhes.component.css']
})
export class UnidadeDetalhesComponent implements OnInit {
  unidade?: UnidadeAtendimento;
  vinculos: ServicoUnidade[] = [];
  horarios: HorarioFuncionamento[] = [];
  avaliacoes: Avaliacao[] = [];
  carregando = true;
  erro = '';

  constructor(
    private route: ActivatedRoute,
    private unidadeService: UnidadeService,
    private vinculoService: ServicoUnidadeService,
    private horarioService: HorarioService,
    private avaliacaoService: AvaliacaoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.erro = 'Unidade nao encontrada.';
      this.carregando = false;
      return;
    }

    this.unidadeService.buscarPorId(id).subscribe({
      next: (unidade) => {
        this.unidade = unidade;
        this.carregando = false;
      },
      error: (error) => {
        this.erro = apiErrorMessage(error, 'Nao foi possivel carregar a unidade.');
        this.carregando = false;
      }
    });

    this.vinculoService.listarPorUnidade(id).subscribe((vinculos) => this.vinculos = vinculos);
    this.horarioService.listar().subscribe((horarios) => {
      this.horarios = horarios.filter((horario) => horario.unidade?.id === id || horario.unidadeId === id);
    });
    this.avaliacaoService.getByUnidade(id).subscribe((avaliacoes) => this.avaliacoes = avaliacoes);
  }
}
