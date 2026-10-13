package kz.pdd;

import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Validated
@CrossOrigin(origins = "${pdd.cors:*}")
public class ProgressController {
    private static final String ID = "[A-Za-z0-9-]{8,64}";
    private final ProgressRepo repo;

    public ProgressController(ProgressRepo repo) { this.repo = repo; }

    public record ProgressDto(@Size(max = 24) String name, @Min(0) long money, @Min(0) int earned,
                              @Min(0) int rides, @Min(0) int clean, @Min(0) int fines,
                              @Size(max = 20000) String data) {}
    public record Row(String name, int earned, int rides) {}

    @GetMapping("/progress/{id}")
    public ResponseEntity<Progress> get(@PathVariable @Pattern(regexp = ID) String id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/progress/{id}")
    public Progress put(@PathVariable @Pattern(regexp = ID) String id, @RequestBody @Valid ProgressDto d) {
        Progress p = repo.findById(id).orElseGet(Progress::new);
        p.id = id;
        p.name = d.name() == null || d.name().isBlank() ? "Водитель" : d.name().strip();
        p.money = d.money(); p.earned = d.earned(); p.rides = d.rides();
        p.clean = d.clean(); p.fines = d.fines(); p.data = d.data();
        p.updatedAt = Instant.now();
        return repo.save(p);
    }

    @GetMapping("/leaderboard")
    public List<Row> top() {
        return repo.findTop20ByOrderByEarnedDesc().stream().map(p -> new Row(p.name, p.earned, p.rides)).toList();
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<String> bad(ConstraintViolationException e) { return ResponseEntity.badRequest().body("Некорректные данные"); }
}
