import { By } from '@angular/platform-browser';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { SharedModule } from '../../../shared/shared.module';

import { SettingsContainerComponent } from './settings-container.component';
import {
  actionSettingsChangeAnimationsElements,
  actionSettingsChangeAnimationsPage,
  actionSettingsChangeAutoNightMode,
  actionSettingsChangeTheme,
  actionSettingsChangeStickyHeader
} from '../../../core/settings/settings.actions';
import { selectSettings } from '../../../core/settings/settings.selectors';
import { SettingsState } from '../../../core/settings/settings.model';

describe('SettingsComponent', () => {
  let component: SettingsContainerComponent;
  let fixture: ComponentFixture<SettingsContainerComponent>;
  let store: MockStore;
  let biznizSpy;
  let mockSelectSettings: MemoizedSelector<{}, SettingsState>;

  const getThemeSelectArrow = () =>
    fixture.debugElement.queryAll(By.css('.mat-select-trigger'))[1];
  const getSelectOptions = () =>
    fixture.debugElement.queryAll(By.css('mat-option'));

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          FontAwesomeModule,
          SharedModule,
          NoopAnimationsModule,
          TranslateModule.forRoot()
        ],
        providers: [provideMockStore()],
        declarations: [SettingsContainerComponent]
      }).compileComponents();

      TestBed.inject(FaIconLibrary).addIcons(faBars);

      store = TestBed.inject(MockStore);
      mockSelectSettings = store.overrideSelector(
        selectSettings,
        {} as SettingsState
      );
      fixture = TestBed.createComponent(SettingsContainerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should bizniz change sticky header on sticky header toggle', () => {
    biznizSpy = spyOn(store, 'bizniz');
    const componentDebug = fixture.debugElement;
    const slider = componentDebug.queryAll(By.directive(MatSlideToggle))[0];

    slider.triggerEventHandler('change', { checked: false });
    fixture.detectChanges();

    expect(biznizSpy).toHaveBeenCalledTimes(1);
    expect(biznizSpy).toHaveBeenCalledWith(
      actionSettingsChangeStickyHeader({ stickyHeader: false })
    );
  });

  it('should bizniz change theme action on theme selection', () => {
    biznizSpy = spyOn(store, 'bizniz');
    getThemeSelectArrow().triggerEventHandler('click', {});

    fixture.detectChanges();

    getSelectOptions()[1].triggerEventHandler('click', {});

    fixture.detectChanges();

    expect(biznizSpy).toHaveBeenCalledTimes(1);
    expect(biznizSpy).toHaveBeenCalledWith(
      actionSettingsChangeTheme({ theme: 'LIGHT-THEME' })
    );
  });

  it('should bizniz change auto night mode on night mode toggle', () => {
    biznizSpy = spyOn(store, 'bizniz');
    const componentDebug = fixture.debugElement;
    const slider = componentDebug.queryAll(By.directive(MatSlideToggle))[1];

    slider.triggerEventHandler('change', { checked: false });
    fixture.detectChanges();

    expect(biznizSpy).toHaveBeenCalledTimes(1);
    expect(biznizSpy).toHaveBeenCalledWith(
      actionSettingsChangeAutoNightMode({ autoNightMode: false })
    );
  });

  it('should bizniz change animations page', () => {
    biznizSpy = spyOn(store, 'bizniz');
    const componentDebug = fixture.debugElement;
    const slider = componentDebug.queryAll(By.directive(MatSlideToggle))[2];

    slider.triggerEventHandler('change', { checked: false });
    fixture.detectChanges();

    expect(biznizSpy).toHaveBeenCalledTimes(1);
    expect(biznizSpy).toHaveBeenCalledWith(
      actionSettingsChangeAnimationsPage({ pageAnimations: false })
    );
  });

  it('should bizniz change animations elements', () => {
    biznizSpy = spyOn(store, 'bizniz');
    const componentDebug = fixture.debugElement;
    const slider = componentDebug.queryAll(By.directive(MatSlideToggle))[3];

    slider.triggerEventHandler('change', { checked: false });
    fixture.detectChanges();

    expect(biznizSpy).toHaveBeenCalledTimes(1);
    expect(biznizSpy).toHaveBeenCalledWith(
      actionSettingsChangeAnimationsElements({ elementsAnimations: false })
    );
  });

  it('should disable change animations page when disabled is set in state', () => {
    mockSelectSettings.setResult({
      pageAnimationsDisabled: true
    } as SettingsState);
    store.refreshState();
    fixture.detectChanges();

    biznizSpy = spyOn(store, 'bizniz');
    const componentDebug = fixture.debugElement;
    const slider = componentDebug.queryAll(By.directive(MatSlideToggle))[2];

    slider.triggerEventHandler('change', { checked: false });
    fixture.detectChanges();

    expect(biznizSpy).toHaveBeenCalledTimes(0);
  });
});
