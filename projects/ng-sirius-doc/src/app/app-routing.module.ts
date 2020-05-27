import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
        path: 'mobile',
        loadChildren: () => import('../mobile/mobile.module').then(m => m.MobileModule)
    }, {
        path: '',
        loadChildren: () => import('../pc/pc.module').then(m => m.PcModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
