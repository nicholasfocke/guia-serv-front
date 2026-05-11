import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
		children: [
			{ path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
			{ path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
			{ path: 'cadastro', loadComponent: () => import('./pages/cadastro/cadastro.component').then(m => m.CadastroComponent) },
			{ path: 'servicos', loadComponent: () => import('./pages/servicos/servicos.component').then(m => m.ServicosComponent) },
			{ path: 'servicos/:id', loadComponent: () => import('./pages/servico-detalhes/servico-detalhes.component').then(m => m.ServicoDetalhesComponent) },
			{ path: 'unidades', loadComponent: () => import('./pages/unidades/unidades.component').then(m => m.UnidadesComponent) },
			{ path: 'unidades/:id', loadComponent: () => import('./pages/unidade-detalhes/unidade-detalhes.component').then(m => m.UnidadeDetalhesComponent) },
			{ path: 'avaliacao', loadComponent: () => import('./pages/avaliacao/avaliacao.component').then(m => m.AvaliacaoComponent), canActivate: [AuthGuard] }
		]
	},
	{
		path: 'admin',
		loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
		canActivate: [AdminGuard],
		children: [
			{ path: '', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
			{ path: 'categorias', loadComponent: () => import('./pages/admin/categorias-admin/categorias-admin.component').then(m => m.CategoriasAdminComponent) },
			{ path: 'servicos', loadComponent: () => import('./pages/admin/servicos-admin/servicos-admin.component').then(m => m.ServicosAdminComponent) },
			{ path: 'unidades', loadComponent: () => import('./pages/admin/unidades-admin/unidades-admin.component').then(m => m.UnidadesAdminComponent) },
			{ path: 'documentos', loadComponent: () => import('./pages/admin/documentos-admin/documentos-admin.component').then(m => m.DocumentosAdminComponent) },
			{ path: 'vinculos', loadComponent: () => import('./pages/admin/vinculos-admin/vinculos-admin.component').then(m => m.VinculosAdminComponent) },
			{ path: 'horarios', loadComponent: () => import('./pages/admin/horarios-admin/horarios-admin.component').then(m => m.HorariosAdminComponent) }
		]
	},
	{ path: '**', redirectTo: '' }
];
