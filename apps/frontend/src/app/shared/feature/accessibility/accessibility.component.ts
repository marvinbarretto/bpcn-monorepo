import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { UserPreferencesStore } from '../../data-access/user-preferences.store';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AccessibilityColourCombinations } from '../../utils/a11y-colours';
import { A11yLetterComponent } from '../../ui/a11y-letter/a11y-letter.component';
import { FocusTrapFactory, FocusTrap } from '@angular/cdk/a11y';
import { OverlayService } from '../../data-access/overlay.service';

@Component({
    selector: 'app-accessibility',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, A11yLetterComponent],
    templateUrl: './accessibility.component.html',
    styleUrl: './accessibility.component.scss'
})
export class AccessibilityComponent implements OnDestroy, OnInit {
  accessibilityForm!: FormGroup;
  colourCombinations = AccessibilityColourCombinations;
  private focusTrap!: FocusTrap;

  constructor(
    public userPreferencesStore: UserPreferencesStore,
    private fb: FormBuilder,
    private focusTrapFactory: FocusTrapFactory,
    private overlayService: OverlayService,
    private elRef: ElementRef, // Reference to this component’s DOM
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize focus trap for this component’s root element
      this.focusTrap = this.focusTrapFactory.create(this.elRef.nativeElement);
      this.focusTrap.focusInitialElement();
    }

    // Initialize the form
    this.accessibilityForm = this.fb.group({
      fontSize: [this.userPreferencesStore.signals.fontSize()],
      bgColor: [this.userPreferencesStore.signals.bgColor()],
      textColor: [this.userPreferencesStore.signals.textColor()],
      lineHeight: [this.userPreferencesStore.signals.lineHeight()],
      letterSpacing: [this.userPreferencesStore.signals.letterSpacing()],
    });

    // Subscribe to form value changes
    this.accessibilityForm.get('fontSize')?.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.userPreferencesStore.updatePreference('fontSize', value);
    });

    this.accessibilityForm.get('bgColor')?.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.userPreferencesStore.updatePreference('bgColor', value);
    });

    this.accessibilityForm.get('textColor')?.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.userPreferencesStore.updatePreference('textColor', value);
    });

    this.accessibilityForm.get('lineHeight')?.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.userPreferencesStore.updatePreference('lineHeight', value);
    });

    this.accessibilityForm.get('letterSpacing')?.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.userPreferencesStore.updatePreference('letterSpacing', value);
    });
  }

  ngOnDestroy(): void {
    if (this.focusTrap) {
      this.focusTrap.destroy(); // Clean up focus trap
    }
  }

  closeOverlay(): void {
    if (this.focusTrap) {
      this.focusTrap.destroy();
    }
    this.overlayService.hideOverlay();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeOverlay();
      event.preventDefault();
    }
  }

  applyCombination(bgColor: string, textColor: string): void {
    this.accessibilityForm.patchValue({ bgColor, textColor });
    this.userPreferencesStore.updatePreference('bgColor', bgColor);
    this.userPreferencesStore.updatePreference('textColor', textColor);
  }

  resetToDefault(): void {
    this.userPreferencesStore.resetToDefault();
    this.accessibilityForm.reset({
      fontSize: this.userPreferencesStore.signals.fontSize(),
      bgColor: this.userPreferencesStore.signals.bgColor(),
      textColor: this.userPreferencesStore.signals.textColor(),
      lineHeight: this.userPreferencesStore.signals.lineHeight(),
      letterSpacing: this.userPreferencesStore.signals.letterSpacing(),
    });
  }
}
