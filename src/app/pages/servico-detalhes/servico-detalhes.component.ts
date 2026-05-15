import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Avaliacao } from '../../core/models/avaliacao.model';
import { ServicoPublico } from '../../core/models/servico-publico.model';
import { AvaliacaoService } from '../../core/services/avaliacao.service';
import { DocumentoService } from '../../core/services/documento.service';
import { ServicoService } from '../../core/services/servico.service';
import { ServicoUnidadeService } from '../../core/services/servico-unidade.service';
import { apiErrorMessage } from '../../shared/utils/api-response.util';

@Component({
  selector: 'app-servico-detalhes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servico-detalhes.component.html',
  styleUrls: ['./servico-detalhes.component.css']
})
export class ServicoDetalhesComponent implements OnInit {
  servico?: ServicoPublico;
  avaliacoes: Avaliacao[] = [];
  carregando = true;
  erro = '';

  constructor(
    private route: ActivatedRoute,
    private servicoService: ServicoService,
    private documentoService: DocumentoService,
    private servicoUnidadeService: ServicoUnidadeService,
    private avaliacaoService: AvaliacaoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.erro = 'Servico nao encontrado.';
      this.carregando = false;
      return;
    }

    this.servicoService.buscarPorId(id).subscribe({
      next: (servico) => {
        this.servico = servico;
        this.carregando = false;
        this.carregarRelacionamentos(id);
      },
      error: (error) => {
        this.erro = apiErrorMessage(error, 'Nao foi possivel carregar o servico.');
        this.carregando = false;
      }
    });

    this.avaliacaoService.getByServico(id).subscribe((avaliacoes) => this.avaliacoes = avaliacoes);
  }

  private carregarRelacionamentos(servicoId: number): void {
    this.documentoService.listarPorServico(servicoId).subscribe({
      next: (documentos) => {
        if (this.servico) {
          this.servico = { ...this.servico, documentos };
        }
      },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel carregar os documentos do servico.')
    });

    this.servicoUnidadeService.listarPorServico(servicoId).subscribe({
      next: (vinculos) => {
        if (this.servico) {
          this.servico = {
            ...this.servico,
            unidades: vinculos
              .map((vinculo) => vinculo.unidade)
              .filter((unidade): unidade is NonNullable<typeof unidade> => Boolean(unidade))
          };
        }
      },
      error: (error) => this.erro = apiErrorMessage(error, 'Nao foi possivel carregar as unidades vinculadas.')
    });
  }
}
