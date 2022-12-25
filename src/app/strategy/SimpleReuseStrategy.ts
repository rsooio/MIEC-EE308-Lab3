import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle, UrlSegment } from '@angular/router';

export class SimpleReuseStrategy implements RouteReuseStrategy {
  static cacheRouters = new Map<string, DetachedRouteHandle>();

  public static deleteRouteCache(url: any): void {
    if (SimpleReuseStrategy.cacheRouters.has(url)) {
      const handle: any = SimpleReuseStrategy.cacheRouters.get(url);
      try {
        handle.componentRef.destory();
      } catch (e) { }
      SimpleReuseStrategy.cacheRouters.delete(url);
    }
  }

  public static deleteAllRouteCache(): void {
    SimpleReuseStrategy.cacheRouters.forEach((handle: any, key) => {
      SimpleReuseStrategy.deleteRouteCache(key);
    });
  }

  // one 进入路由触发，是否同一路由时复用路由
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // if (future.routeConfig?.data && future.routeConfig.data['singleRoute'] != undefined ) return false;
    return future.routeConfig === curr.routeConfig &&
      JSON.stringify(future.params) === JSON.stringify(curr.params);
  }

  // 获取存储路由
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    if (route.data['keep']) {
      const key = route.data['singleRoute']
      if (key && SimpleReuseStrategy.cacheRouters.has(key)) {
        // console.log('fetch', key)
        return SimpleReuseStrategy.cacheRouters.get(key) || '';
      } else {
        const url = this.getFullRouteURL(route);
        if (SimpleReuseStrategy.cacheRouters.has(url)) {
          // console.log('fetch', url)
          return SimpleReuseStrategy.cacheRouters.get(url) || '';
        }
      }
    }
    return null || '';
  }

  // 是否允许复用路由
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return Boolean(route.data['keep']);
  }

  // 当路由离开时会触发，存储路由
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    if (route.data['singleRoute']) {
      // console.log('store', route.data['singleRoute']);
      SimpleReuseStrategy.cacheRouters.set(route.data['singleRoute'], handle);
    } else {
      const url = this.getFullRouteURL(route);
      // console.log('store', url);
      SimpleReuseStrategy.cacheRouters.set(url, handle);
    }
  }

  //  是否允许还原路由
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getFullRouteURL(route);
    const key = route.data['singleRoute']
    return Boolean(route.data['keep'] && SimpleReuseStrategy.cacheRouters.has(url) || SimpleReuseStrategy.cacheRouters.has(key));
  }

  // 获取当前路由url
  private getFullRouteURL(route: ActivatedRouteSnapshot): string {
    const { pathFromRoot } = route;
    let fullRouteUrlPath: string[] = [];
    pathFromRoot.forEach((item: ActivatedRouteSnapshot) => {
      fullRouteUrlPath = fullRouteUrlPath.concat(this.getRouteUrlPath(item));
    });
    return `/${fullRouteUrlPath.join('/')}`;

  }

  private getRouteUrlPath(route: ActivatedRouteSnapshot) {
    return route.url.map(urlSegment => urlSegment.path);
  }
}
