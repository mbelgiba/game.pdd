package kz.pdd;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.Instant;

/** Облачное сохранение игрока. Ключ — анонимный идентификатор устройства (UUID). */
@Entity
public class Progress {
    @Id public String id;
    public String name;
    public long money;
    public int earned, rides, clean, fines;
    @Column(length = 20000) public String data;
    public Instant updatedAt = Instant.now();
}
