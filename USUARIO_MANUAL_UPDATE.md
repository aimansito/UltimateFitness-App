# Manual Update Required for Usuario.php

Due to file corruption issues with automated edits, please make these 3 small, manual changes to `src/Entity/Usuario.php`:

## Change 1: Add dietasAsignadas field (line 126-127)

**Location:** After line 126 (`private Collection $valoracionesPlatos;`)

**Add:**
```php
    #[ORM\OneToMany(targetEntity: Dieta::class, mappedBy: 'asignadoAUsuario')]
    private Collection $dietasAsignadas;
```

## Change 2: Initialize in constructor (line 134)

**Location:** Inside `__construct()` method, after `$this->valoracionesPlatos = new ArrayCollection();`

**Add:**
```php
        $this->dietasAsignadas = new ArrayCollection();
```

## Change 3: Add management methods (after line 526)

**Location:** After the `removeValoracionesPlato` method, before `// MÉTODOS AUXILIARES`

**Add:**
```php

    public function getDietasAsignadas(): Collection
    {
        return $this->dietasAsignadas;
    }

    public function addDietaAsignada(Dieta $dieta): static
    {
        if (!$this->dietasAsignadas->contains($dieta)) {
            $this->dietasAsignadas->add($dieta);
            $dieta->setAsignadoAUsuario($this);
        }
        return $this;
    }

    public function removeDietaAsignada(Dieta $dieta): static
    {
        if ($this->dietasAsignadas->removeElement($dieta)) {
            if ($dieta->getAsignadoAUsuario() === $this) {
                $dieta->setAsignadoAUsuario(null);
            }
        }
        return $this;
    }
```

---

**Save the file** after making these 3 changes, then the entities will be ready!
