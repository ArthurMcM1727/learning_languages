using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;
using System.Linq;
using MIConvexHull;

class Program
{
    static void Main(string[] args)
    {
        try
        {
            string inputPath = "input.jpg";
            string outputPath = "output_lowpoly.jpg";
            int pointCount = 8000; // Number of vertices

            Bitmap input = new Bitmap(inputPath);
            var points = GenerateRandomPoints(input.Width, input.Height, pointCount);

            // Add corners to ensure full coverage
            points.Add(new Vertex(0, 0));
            points.Add(new Vertex(input.Width - 1, 0));
            points.Add(new Vertex(0, input.Height - 1));
            points.Add(new Vertex(input.Width - 1, input.Height - 1));

            var triangles = Triangulate(points);

            Bitmap output = new Bitmap(input.Width, input.Height);

            using (Graphics g = Graphics.FromImage(output))
            {
                foreach (var tri in triangles)
                {
                    var pts = tri.Vertices.Select(v => new PointF((float)v.X, (float)v.Y)).ToArray();
                    if (pts.Length != 3) continue; // Only process triangles
                    Color avgColor = GetTriangleAverageColor(input, pts);
                    using (SolidBrush brush = new SolidBrush(avgColor))
                    {
                        g.FillPolygon(brush, pts);
                    }
                }
            }

            output.Save(outputPath, ImageFormat.Jpeg);
            Console.WriteLine("Low poly image saved as " + outputPath);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }

    // Generate random points
    static List<Vertex> GenerateRandomPoints(int width, int height, int count)
    {
        Random rand = new Random();
        var points = new List<Vertex>();
        for (int i = 0; i < count; i++)
        {
            points.Add(new Vertex(rand.Next(width), rand.Next(height)));
        }
        return points;
    }

    // Triangulate points using MIConvexHull
    static IEnumerable<DefaultTriangulationCell<Vertex>> Triangulate(List<Vertex> points)
    {
        // 1e-10 is a typical tolerance value for 2D triangulation
        return DelaunayTriangulation<Vertex, DefaultTriangulationCell<Vertex>>.Create(points, 1e-10).Cells;
    }

    // Get average color of a triangle
    static Color GetTriangleAverageColor(Bitmap bmp, PointF[] pts)
    {
        Rectangle bounds = GetBoundingBox(pts, bmp.Width, bmp.Height);
        int r = 0, g = 0, b = 0, count = 0;
        for (int y = bounds.Top; y < bounds.Bottom; y++)
        {
            for (int x = bounds.Left; x < bounds.Right; x++)
            {
                if (PointInTriangle(new PointF(x, y), pts[0], pts[1], pts[2]))
                {
                    Color c = bmp.GetPixel(x, y);
                    r += c.R; g += c.G; b += c.B; count++;
                }
            }
        }
        if (count == 0) return Color.Black;
        return Color.FromArgb(r / count, g / count, b / count);
    }

    // Bounding box for triangle
    static Rectangle GetBoundingBox(PointF[] pts, int maxWidth, int maxHeight)
    {
        float minX = pts.Min(p => p.X);
        float minY = pts.Min(p => p.Y);
        float maxX = pts.Max(p => p.X);
        float maxY = pts.Max(p => p.Y);
        return Rectangle.FromLTRB(
            (int)Math.Max(0, Math.Floor(minX)),
            (int)Math.Max(0, Math.Floor(minY)),
            (int)Math.Min(maxWidth, Math.Ceiling(maxX)),
            (int)Math.Min(maxHeight, Math.Ceiling(maxY))
        );
    }

    // Point in triangle test
    static bool PointInTriangle(PointF p, PointF p0, PointF p1, PointF p2)
    {
        float s = p0.Y * p2.X - p0.X * p2.Y + (p2.Y - p0.Y) * p.X + (p0.X - p2.X) * p.Y;
        float t = p0.X * p1.Y - p0.Y * p1.X + (p0.Y - p1.Y) * p.X + (p1.X - p0.X) * p.Y;

        if ((s < 0) != (t < 0))
            return false;

        float A = -p1.Y * p2.X + p0.Y * (p2.X - p1.X) + p0.X * (p1.Y - p2.Y) + p1.X * p2.Y;
        return A < 0 ? (s <= 0 && s + t >= A) : (s >= 0 && s + t <= A);
    }
}

// Vertex class for MIConvexHull
public class Vertex : MIConvexHull.IVertex
{
    public double[] Position { get; set; }
    public double X => Position[0];
    public double Y => Position[1];

    public Vertex(double x, double y)
    {
        Position = new double[] { x, y };
    }
}