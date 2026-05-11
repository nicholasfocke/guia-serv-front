import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HorarioFuncionamento } from '../../core/models/horario-funcionamento.model';
import { ServicoUnidade } from '../../core/models/servico-unidade.model';
import { UnidadeAtendimento } from '../../core/models/unidade-atendimento.model';
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
  carregando = true;
  erro = '';

  constructor(
    private route: ActivatedRoute,
    private unidadeService: UnidadeService,
    private vinculoService: ServicoUnidadeService,
    private horarioService: HorarioService
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

    this.vinculoService.listar().subscribe((vinculos) => {
      this.vinculos = vinculos.filter((vinculo) => vinculo.unidade?.id === id || vinculo.unidadeId === id);
    });
    this.horarioService.listar().subscribe((horarios) => {
      this.horarios = horarios.filter((horario) => horario.unidade?.id === id || horario.unidadeId === id);
    });
  }
}
