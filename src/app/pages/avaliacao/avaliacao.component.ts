import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServicoPublico } from '../../core/models/servico-publico.model';
import { AvaliacaoService } from '../../core/services/avaliacao.service';
import { ServicoService } from '../../core/services/servico.service';
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
  servicoId = '';
  nota = 5;
  comentario = '';
  carregando = false;
  mensagem = '';
  erro = '';

  constructor(
    private route: ActivatedRoute,
    private servicoService: ServicoService,
    private avaliacaoService: AvaliacaoService
  ) {}

  ngOnInit(): void {
    this.servicoId = this.route.snapshot.queryParamMap.get('servicoId') ?? '';
    this.servicoService.listar().subscribe((servicos) => this.servicos = servicos);
  }

  enviar(): void {
    const id = Number(this.servicoId);
    if (!id) {
      this.erro = 'Selecione um servico para avaliar.';
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.mensagem = '';
    this.avaliacaoService.criar({ servicoId: id, nota: this.nota, comentario: this.comentario }).subscribe({
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
